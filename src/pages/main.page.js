export class MainPage {
    // техническое описание страницы

    constructor(page) {
        this.page = page;
        this.signupLink = page.getByRole('link', { name: 'Sign up' }).describe('Кнопка//cсылка зарегистрироваться');
        this.loginLink = page.getByRole('link', { name: 'Login' }).describe('Кнопка//cсылка авторизоваться');
    }
    // бизнесовые действия со страницей

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

}

