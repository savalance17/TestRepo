import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

// Переменные
let email = faker.internet.email({provider: 'qa.guru' });
let name = faker.person.fullName(); // 'Allen Brown'
let password  = faker.internet.password({ length: 10 });

const url = 'https://realworld.qa.guru/';

const getRegistration = async (page, email, name, password, url) => {
    await page.goto(url);
    await page.getByRole('link', { name: 'Sign up' }).click();
    await page.getByRole('textbox', { name: 'Your Name' }).click();
    await page.getByRole('textbox', { name: 'Your Name' }).fill(name);
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Sign up' }).click();
};

test('Пользователь может зарегистрироваться используя email и пароль', async ({ page }) => {
    getRegistration(page, email, name, password, url);  
    await expect(page.getByRole('navigation')).toContainText(name);
});

test('Пользователь может изменить свое имя в профиле', async ({ page }) => {
    getRegistration(page, email, name, password, url); 
    // todo Дописать тест на изменение имени в профиле 
    await expect(page.getByRole('navigation')).toContainText(name);
    }); 