import { expect } from '@playwright/test';
import { MainPage } from '../pages/main.page';
import { AutorizationPage } from '../pages/autorization.page';

/**
 * Авторизация пользователя
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль пользователя
 * @param {string} userName - Имя пользователя
 */
export async function login(page, email, password, userName) {
    const mainPage = new MainPage(page);
    const autorizationPage = new AutorizationPage(page);

    // Открываем главную страницу
    await mainPage.openMainPage();

    // Переходим на страницу авторизации
    await mainPage.gotoAutorization();

    // Аутентифицируемся
    await autorizationPage.autorization(email, password);

    // Проверяем, что пользователь авторизован
    const actualUserName = await mainPage.getUserName();
    expect(actualUserName).toContain(userName);
}