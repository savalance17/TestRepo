// Страница просмотра статьи
export class ArticleViewPage {
    constructor(page) {
        this.page = page;
        this.articleTitle = page.locator('.article-page .banner h1');
        this.articleContent = page.locator('.article-content');
        this.articleBody = page.locator('.article-content p');
        this.tagList = page.locator('.tag-list');
        this.tagItems = page.locator('.tag-list li');
        // Автор статьи в баннере
        this.author = page.locator('.banner .article-meta .author');
        // Кнопка удаления статьи в баннере
        this.deleteArticleButton = page.locator('.banner').getByRole('button', { name: 'Delete Article' });
        // Поле для ввода комментария
        this.commentInput = page.getByPlaceholder('Write a comment...');
        // Кнопка отправки комментария
        this.postCommentButton = page.getByRole('button', { name: 'Post Comment' });
        // Контейнер со списком комментариев
        this.commentsContainer = page.locator('.card.comment-form').locator('..');
        // Локатор текста комментария
        this.commentTextLocator = page.locator('.card-block p.card-text');
        // Локатор футера комментария
        this.commentFooterLocator = page.locator('.card-footer');
    }

    /**
     * Получение заголовка статьи
     * @returns {Promise<string>} Заголовок статьи
     */
    async getArticleTitle() {
        console.log('Получаем заголовок статьи');
        await this.articleTitle.waitFor({ state: 'visible' });
        const title = await this.articleTitle.textContent();
        return title ? title.trim() : '';
    }

    /**
     * Получение всех данных статьи
     * @returns {Promise<{title: string, body: string, tags: string[], author: string}>} Объект с данными статьи
     */
    async getArticleData() {
        console.log('Получаем данные статьи');

        // Ожидаем загрузку ключевых элементов
        await this.articleTitle.waitFor({ state: 'visible' });
        await this.articleBody.waitFor({ state: 'visible' });
        await this.author.waitFor({ state: 'visible' });
        await this.tagList.waitFor({ state: 'visible' });

        // Получаем заголовок
        const title = await this.articleTitle.textContent();

        // Получаем содержание статьи
        const body = await this.articleBody.textContent();

        // Получаем теги
        const tagsCount = await this.tagItems.count();
        const tags = [];
        for (let i = 0; i < tagsCount; i++) {
            const tagText = await this.tagItems.nth(i).textContent();
            if (tagText) {
                tags.push(tagText.trim());
            }
        }

        // Получаем автора
        const author = await this.author.textContent();

        return {
            title: title ? title.trim() : '',
            body: body ? body.trim() : '',
            tags: tags,
            author: author ? author.trim() : ''
        };
    }

    /**
     * Заполнение и отправка комментария
     * @param {string} commentText - Текст комментария
     */
    async addComment(commentText) {
        console.log(`Добавляем комментарий: "${commentText}"`);

        // Заполняем поле для ввода комментария
        await this.commentInput.fill(commentText);

        // Нажимаем кнопку "Post Comment"
        await this.postCommentButton.click();

        // Ждем появления комментария на странице
        const commentLocator = this.commentTextLocator.filter({ hasText: commentText });
        await commentLocator.waitFor({ state: 'visible' });
        console.log('Комментарий отправлен');
    }

    /**
     * Получение данных комментария по тексту
     * @param {string} commentText - Текст комментария для поиска
     * @returns {Promise<{text: string, author: string} | null>} Объект с данными комментария или null, если не найден
     */
    async getCommentData(commentText) {
        console.log(`Получаем данные комментария: "${commentText}"`);
        
        const commentTextLocator = this.commentTextLocator.filter({ hasText: commentText });
        
        // Пытаемся дождаться появления комментария
        try {
            await commentTextLocator.waitFor({ state: 'visible', timeout: 5000 });
        } catch (error) {
            // Если комментарий не появился в течение таймаута, возвращаем null
            return null;
        }
        
        // Получаем текст комментария
        const text = await commentTextLocator.textContent();
        
        // Получаем автора комментария
        const commentCard = commentTextLocator.locator('..').locator('..');
        const authorLocator = commentCard.locator(this.commentFooterLocator);
        const author = await authorLocator.textContent();
        
        return {
            text: text ? text.trim() : '',
            author: author ? author.trim() : ''
        };
    }
}

