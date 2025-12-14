export class MainPage {
    constructor(page) {
        this.page = page;
        this.signupLink = page.getByRole('link', { name: 'Sign up' }).describe('Кнопка//cсылка зарегистрироваться');
        this.loginLink = page.getByRole('link', { name: 'Login' }).describe('Кнопка//cсылка авторизоваться');
        this.globalFeedLink = page.getByRole('button', { name: 'Global Feed' });
        // Локаторы для статей в Global Feed
        this.articlePreviews = page.locator('.article-preview');
        this.articleTitles = page.locator('.article-preview h1');
        // Локатор для проверки загруженных статей (article-meta появляется только в загруженных статьях)
        this.articleMeta = page.locator('.article-preview .article-meta');
        // Локатор индикатора загрузки статей
        this.loadingIndicator = page.locator('.article-preview em', { hasText: 'Loading articles list...' });
        // Локаторы для пагинации
        this.nextPageButton = page.getByRole('button', { name: 'Next page' });
        this.pagination = page.locator('.pagination');
        this.profileName = page.locator('.dropdown-toggle');
        this.articleCreateLink = page.getByRole('link', { name: 'New Article' });
    }

    /*
    * Переход на страницу регистрации
    */
    async gotoRegister() {
        console.log('Переходим на страницу регистрации');
        this.signupLink.click();
    }
    /**
     * Переход на страницу авторизации
     */
    async gotoAutorization() {
        console.log('Переходим на страницу авторизации');
        await this.loginLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /*
    * Открытие страницы
    */
    async open(url) {
        console.log(`Открываем страницу ${url}`);
        await this.page.goto(url);
    }

    /**
     * Открытие главной страницы
     */
    async openMainPage() {
        console.log('Открываем главную страницу');
        await this.page.goto('');
    }

    /**
     * Открытие таба "Global Feed"
     */
    async openGlobalFeed() {
        console.log('Открываем таблицу "Global Feed"');
        await this.globalFeedLink.click();
    }

    /**
     * Ожидание завершения загрузки статей
     * Best practice: ждем появления реального контента (article-meta) вместо исчезновения индикатора
     */
    async waitForArticlesLoad() {
        console.log('Ожидаем завершения загрузки статей');
        
        // Ждем, пока появится хотя бы одна загруженная статья (с article-meta)
        await this.articleMeta.first().waitFor({ state: 'visible', timeout: 10000 });
        
        console.log('Статьи загружены');
    }

    /**
     * Получение списка заголовков статей из Global Feed
     * @returns {Promise<string[]>} Массив заголовков статей
     */
    async getArticleTitles() {
        console.log('Получаем список заголовков статей из Global Feed');
        // Ждем завершения загрузки статей
        await this.page.waitForTimeout(1000);
        await this.waitForArticlesLoad();
        
        const titlesCount = await this.articleTitles.count();
        const titles = [];
        
        for (let i = 0; i < titlesCount; i++) {
            const title = await this.articleTitles.nth(i).textContent();
            if (title) {
                titles.push(title.trim());
            }
        }
        
        return titles;
    }

    /**
     * Проверка наличия следующей страницы в пагинации
     * @returns {Promise<boolean>} true если есть следующая страница
     */
    async hasNextPage() {
        const nextButton = this.nextPageButton;
        const isDisabled = await nextButton.getAttribute('aria-disabled');
        return isDisabled !== 'true';
    }

    /**
     * Переход на следующую страницу пагинации
     */
    async goToNextPage() {
        console.log('Переходим на следующую страницу');
        await this.nextPageButton.click();
        await this.waitForArticlesLoad();
    }

    /**
     * Поиск статьи на текущей странице
     * @param {string} articleTitle - Заголовок статьи для поиска
     * @returns {Promise<{title: string, description: string, author: string} | null>} Данные статьи или null, если не найдена
     */
    async findArticleOnCurrentPage(articleTitle) {
        const titlesCount = await this.articleTitles.count();
        const normalizedSearchTitle = articleTitle.trim().toLowerCase();
        
        for (let i = 0; i < titlesCount; i++) {
            const currentTitle = await this.articleTitles.nth(i).textContent();
            if (currentTitle && currentTitle.trim().toLowerCase().includes(normalizedSearchTitle)) {
                // Нашли статью, получаем дополнительные данные
                const articlePreview = this.articlePreviews.nth(i);
                const description = await articlePreview.locator('p').first().textContent();
                const author = await articlePreview.locator('.author').textContent();
                
                return {
                    title: currentTitle.trim(),
                    description: description ? description.trim() : '',
                    author: author ? author.trim() : ''
                };
            }
        }
        
        return null;
    }

    /**
     * Получение данных статьи по заголовку из Global Feed (поиск по всем страницам)
     * @param {string} articleTitle - Заголовок статьи для поиска
     * @param {number} maxPages - Максимальное количество страниц для поиска (по умолчанию 10)
     * @returns {Promise<{title: string, description: string, author: string} | null>} Данные статьи или null, если не найдена
     */
    async getArticleByTitle(articleTitle, maxPages = 10) {
        console.log(`Ищем статью с заголовком: "${articleTitle}"`);
        
        // Ждем завершения загрузки статей на первой странице
        await this.waitForArticlesLoad();
        
        let currentPage = 1;
        
        while (currentPage <= maxPages) {
            console.log(`Ищем на странице ${currentPage}`);
            
            // Ищем статью на текущей странице
            const article = await this.findArticleOnCurrentPage(articleTitle);
            
            if (article) {
                console.log(`Статья найдена на странице ${currentPage}`);
                return article;
            }
            
            // Проверяем, есть ли следующая страница
            if (!(await this.hasNextPage())) {
                console.log(`Достигнута последняя страница (${currentPage})`);
                break;
            }
            
            // Переходим на следующую страницу
            await this.goToNextPage();
            currentPage++;
        }
        
        console.log(`Статья с заголовком "${articleTitle}" не найдена в Global Feed (проверено ${currentPage} страниц)`);
        return null;
    }

    /**
     * Получение локатора имени пользователя
     * @returns {Locator} Локатор имени пользователя
     */
    getProfileNameLocator() {
        return this.profileName;
    }

    /**
     * Получение имени авторизованного пользователя
     * @returns {Promise<string>} Имя пользователя
     */
    async getUserName() {
        console.log('Получаем имя авторизованного пользователя');
        await this.profileName.waitFor({ state: 'visible' });
        const userName = await this.profileName.textContent();
        return userName ? userName.trim() : '';
    }

    /**
     * Кликаем по ссылке "New Article"
     */
    async clickArticleCreateLink() {
        console.log('Кликаем по ссылке "New Article"');
        await this.articleCreateLink.waitFor({ state: 'visible' });
        await this.articleCreateLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

}

