import { expect } from '@playwright/test';

// Домашняя страница
export class HomePage {
    // техническое описание страницы
    
    constructor (page) {
        this.page = page;
        //todo нейминг и селектор
        this.profileName = page.locator('.dropdown-toggle');
        this.articleCreateLink = page.getByRole('link', { name: 'New Article' });
    }
    
    // бизнесовые действия со страницей

    getProfileNameLocator() {
        return this.profileName;
    }

    /*
    * Проверка авторизации
    */
    async checkUserName(userName) {
        console.log('Проверяем имя авторизованного пользователя');
        // Проверяем, что пользователь авторизован
        await expect(this.getProfileNameLocator()).toContainText(userName);
    }

    /**
     * Кликаем по ссылке "New Article"
     */
    async clickArticleCreateLink() {
        console.log('Кликаем по ссылке "New Article"');
        await expect(this.articleCreateLink).toBeVisible();
        await this.articleCreateLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
}