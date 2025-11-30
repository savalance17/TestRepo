import { test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { users } from '../fixtures/users';
import { login } from '../src/utils/utils';
import { ArticleCreatePage } from '../src/pages/articleCreate.page';
import { HomePage } from '../src/pages/home.page';
import { ArticleViewPage } from '../src/pages/articleView.page';

test.describe('Домашнее задание', () => {
    const user = {
        email: users.testUserEmail,
        password: users.testUserPassword,
        name: users.testUserName,
    };

    const url = 'https://realworld.qa.guru/';

    // Переменные для данных теста
    let homePage;
    let articleCreatePage;
    let articleViewPage;
    let title;
    let description;
    let body;
    let tags;

    test.beforeEach(async ({ page }) => {
        // Авторизуемся
        await login(page, url, user.email, user.password, user.name);

        // Создаем экземпляры страниц
        homePage = new HomePage(page);
        articleCreatePage = new ArticleCreatePage(page);
        articleViewPage = new ArticleViewPage(page);

        // Генерируем уникальные данные для каждого теста
        title = faker.lorem.sentence();
        description = faker.lorem.paragraph();
        body = faker.lorem.paragraphs(3);
        tags = Array.from({ length: 3 }, () => faker.lorem.word());
    })

    test('Создание новой статьи без тегов', async ({ page }) => {
        // Переходим на страницу создания статьи
        await homePage.clickArticleCreateLink();

        // Заполняем поля статьи
        await articleCreatePage.createAndPublishArticle(title, description, body);

        // Проверяем, что статья создана
        await articleViewPage.checkArticleIsOpenedByTitle(title);
    })

    test('Создание новой статьи с указанием тегов', async ({ page }) => {
        // Переходим на страницу создания статьи
        await homePage.clickArticleCreateLink();

        // Заполняем поля статьи
        await articleCreatePage.createAndPublishArticle(title, description, body, tags);

        // Проверяем, что статья создана
        await articleViewPage.checkArticleIsOpenedByTitle(title);
    })

    test('Проверка заполненных полей статьи при создании', async ({ page }) => {
        // Переходим на страницу создания статьи
        await homePage.clickArticleCreateLink();

        // Заполняем все поля при создании статьи
        await articleCreatePage.createAndPublishArticle(title, description, body, tags);

        // Проверяем что все поля заполнены корректно
        await articleViewPage.checkAllArticleFields(title, body, tags, user.name);
    })

    test('Проверка содержимого созданной статьи при просмотре', async ({ page }) => {
        // Переходим на страницу создания статьи
        await homePage.clickArticleCreateLink();

        // Создаем новую статью
        await articleCreatePage.createAndPublishArticle(title, description, body, tags);

        // Проверяем содержимое статьи
        await articleViewPage.checkAllArticleFields(title, body, tags, user.name);
    })

    test('Добавление комментария к статье', async ({ page }) => {
        const comment = faker.lorem.sentence();

        // Переходим на страницу создания статьи
        await homePage.clickArticleCreateLink();

        // Создаем новую статью
        await articleCreatePage.createAndPublishArticle(title, description, body, tags);

        // Проверяем, что статья создана
        await articleViewPage.checkArticleIsOpenedByTitle(title);

        // Добавляем комментарий к статье
        await articleViewPage.addComment(comment);

        // Проверяем, что комментарий добавлен
        await articleViewPage.checkComment(comment, true, user.name);
    })

    test('Множественное добавление комментариев к статье', async ({ page }) => {
        // Создаем массив из 3 комментариев
        const comments = Array.from({ length: 3 }, () => faker.lorem.sentence());

        // Переходим на страницу создания статьи
        await homePage.clickArticleCreateLink();

        // Создаем новую статью
        await articleCreatePage.createAndPublishArticle(title, description, body, tags);

        // Проверяем, что статья создана
        await articleViewPage.checkArticleIsOpenedByTitle(title);

        // Добавляем комментарии к статье
        for (let i = 0; i < comments.length; i++) {
            console.log(`Добавляем комментарий ${i + 1} из ${comments.length}`);
            await articleViewPage.addComment(comments[i]);
        }

        // Проверяем, что все комментарии присутствуют на странице
        for (const comment of comments) {
            await articleViewPage.checkComment(comment, true, user.name);
        }
    })
})