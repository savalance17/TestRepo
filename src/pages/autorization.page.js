import { expect } from '@playwright/test';
export class AutorizationPage {

    // техническое описание страницы

    constructor(page) {
        this.page = page;
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.pageTitle = page.getByRole('heading', { name: 'Sign in' });
        this.needAnAccountLink = page.getByRole('link', { name: 'Need an account?' });
    }
    // бизнесовые действия со страницей

   /**
    * Проверка, что страница авторизации открыта
    * и что есть ссылка на страницу регистрации
    */
   async isPageOpened() {
    console.log('Проверяем, что страница авторизации открыта');
    await expect(this.pageTitle).toBeVisible();
    await expect(this.needAnAccountLink).toBeVisible();
   }

    /**
     * Заполнение поля Email
     * @param {string} email - Email пользователя
    */
    async fillEmail(email) {
        console.log('Заполняем поле Email');
        await expect(this.emailInput).toBeVisible();
        await this.emailInput.click();
        await this.emailInput.fill(email);
    }

    /**
     * Заполнение поля Email
     * @param {string} email - Email пользователя
    */
    async fillPassword(password) {
        console.log('Заполняем поле Пароль');
        await expect(this.passwordInput).toBeVisible();
        await this.passwordInput.click();
        await this.passwordInput.fill(password);
    }

    /**
     * Заполнение поля Email
     * @param {string} email - Email пользователя
    */
    async clickLoginButton() {
        console.log('Нажимаем кнопку Авторизоваться');
        await expect(this.loginButton).toBeVisible();
        await this.loginButton.click();
    }

    /**
     * Аутентификация пользователя
     * @param {string} email - Email пользователя
     * @param {string} password - Пароль пользователя
     */
    async autorization(email, password) {
        await this.isPageOpened();
        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.clickLoginButton();
        await this.page.waitForLoadState('domcontentloaded');
    }
}