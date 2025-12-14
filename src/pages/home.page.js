// Домашняя страница
export class HomePage {
    // техническое описание страницы
    
    constructor (page) {
        this.page = page;
        //todo нейминг и селектор
        this.profileName = page.locator('.dropdown-toggle');
        this.articleCreateLink = page.getByRole('link', { name: 'New Article' });
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