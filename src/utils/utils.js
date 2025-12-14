import { expect } from '@playwright/test';
import { MainPage } from '../pages/main.page';
import { AutorizationPage } from '../pages/autorization.page';
import { HomePage } from '../pages/home.page';

/**
 * Авторизация пользователя
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль пользователя
 * @param {string} userName - Имя пользователя
 */
export async function login(page, email, password, userName) {
    const mainPage = new MainPage(page);
    const autorizationPage = new AutorizationPage(page);
    const homePage = new HomePage(page);

    // Открываем главную страницу
    await mainPage.openMainPage();

    // Переходим на страницу авторизации
    await mainPage.gotoAutorization();

    // Аутентифицируемся
    await autorizationPage.autorization(email, password);

    // Проверяем, что пользователь авторизован
    const actualUserName = await homePage.getUserName();
    expect(actualUserName).toContain(userName);
}