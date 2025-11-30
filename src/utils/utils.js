import { MainPage } from '../pages/main.page';
import { AutorizationPage } from '../pages/autorization.page';
import { HomePage } from '../pages/home.page';

/**
 * Авторизация пользователя
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль пользователя
 * @param {string} baseUrl - Базовый URL сайта (по умолчанию 'https://realworld.qa.guru/')
 */
export async function login(page, baseUrl, email, password, userName) {
    const mainPage = new MainPage(page);
    const autorizationPage = new AutorizationPage(page);
    const homePage = new HomePage(page);

    // Открываем главную страницу
    await mainPage.open(baseUrl);

    // Переходим на страницу авторизации
    await mainPage.gotoAutorization();

    // Аутентифицируемся
    await autorizationPage.autorization(email, password);

    // Проверяем, что пользователь авторизован
    await homePage.checkUserName(userName);
}