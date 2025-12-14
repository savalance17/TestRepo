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
    * Ожидание загрузки страницы авторизации
    */
   async waitForPageLoad() {
    console.log('Ожидаем загрузку страницы авторизации');
    await this.pageTitle.waitFor({ state: 'visible' });
    await this.needAnAccountLink.waitFor({ state: 'visible' });
   }

    /**
     * Заполнение поля Email
     * @param {string} email - Email пользователя
    */
    async fillEmail(email) {
        console.log('Заполняем поле Email');
        await this.emailInput.waitFor({ state: 'visible' });
        await this.emailInput.click();
        await this.emailInput.fill(email);
    }

    /**
     * Заполнение поля Password
     * @param {string} password - Пароль пользователя
    */
    async fillPassword(password) {
        console.log('Заполняем поле Пароль');
        await this.passwordInput.waitFor({ state: 'visible' });
        await this.passwordInput.click();
        await this.passwordInput.fill(password);
    }

    /**
     * Нажатие кнопки Login
    */
    async clickLoginButton() {
        console.log('Нажимаем кнопку Авторизоваться');
        await this.loginButton.waitFor({ state: 'visible' });
        await this.loginButton.click();
    }

    /**
     * Аутентификация пользователя
     * @param {string} email - Email пользователя
     * @param {string} password - Пароль пользователя
     */
    async autorization(email, password) {
        await this.waitForPageLoad();
        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.clickLoginButton();
        await this.page.waitForLoadState('domcontentloaded');
    }
}