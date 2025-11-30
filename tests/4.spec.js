import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { console } from 'inspector';

const user = {
    email: faker.internet.email({provider: 'qa.guru' }),
    name: faker.person.fullName(), // 'Allen Brown'
    password: faker.internet.password({ length: 10 }),
    method() {}
}

/*
const faker = {
internet: {
email() {
}
}

}
*/
// Переменные
//let email = faker.internet.email({provider: 'qa.guru' });
//let name = faker.person.fullName(); // 'Allen Brown'
///let password  = faker.internet.password({ length: 10 });

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

test('Пользователь может зарегистрироваться используя email и пароль v2', async ({ page }) => {
    getRegistration(page, user.email, user.name, user.password, url);  
    await expect(page.getByRole('navigation')).toContainText(user.name);
});

test('Пользователь может изменить свое имя в профиле', async ({ page }) => {

    // const jsonCopy = JSON.parse(JSON.stringify(user));
     const jsonCopy = structuredClone(user);
    //const jsonCopy = {...user};


    console.log('jsonCopy');

    console.log(jsonCopy);
    const {name, email, password} = jsonCopy;

    /* 
    const name = user.name;
    const password = user.password;
    const email = user.email;
    */

    getRegistration(page, email, name, password, url); 
    // todo Дописать тест на изменение имени в профиле 
    await expect(page.getByRole('navigation')).toContainText(name);
    }); 