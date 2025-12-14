import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { users } from '../fixtures/users';
import { login } from '../src/utils/utils';
import { ArticleCreatePage } from '../src/pages/articleCreate.page';
import { ArticleViewPage } from '../src/pages/articleView.page';
import { MainPage } from '../src/pages/main.page';

test.describe('Домашнее задание', () => {
    const user = {
        email: users.testUserEmail,
        password: users.testUserPassword,
        name: users.testUserName,
    };

    // Переменные для данных теста
    let articleCreatePage;
    let articleViewPage;
    let mainPage;
    let title;
    let description;
    let body;
    let tags;

    test.beforeEach(async ({ page }) => {
        // Авторизуемся
        await login(page, user.email, user.password, user.name);

        // Создаем экземпляры страниц
        articleCreatePage = new ArticleCreatePage(page);
        articleViewPage = new ArticleViewPage(page);
        mainPage = new MainPage(page);

        // Генерируем уникальные данные для каждого теста
        title = faker.lorem.sentence();
        description = faker.lorem.paragraph();
        body = faker.lorem.paragraphs(3);
        tags = Array.from({ length: 3 }, () => faker.lorem.word());
    })

    test('Создание новой статьи без тегов', async () => {
        // Переходим на страницу создания статьи
        await mainPage.clickArticleCreateLink();

        // Заполняем поля статьи
        await articleCreatePage.createAndPublishArticle(title, description, body);

        // Получаем заголовок статьи и проверяем
        const articleTitle = await articleViewPage.getArticleTitle();
        expect(articleTitle).toContain(title);
    })

    test('Создание новой статьи с указанием тегов', async () => {
        // Переходим на страницу создания статьи
        await mainPage.clickArticleCreateLink();

        // Заполняем поля статьи
        await articleCreatePage.createAndPublishArticle(title, description, body, tags);

        // Получаем заголовок статьи и проверяем
        const articleTitle = await articleViewPage.getArticleTitle();
        expect(articleTitle).toContain(title);
    })

    test('Проверяем что созданная статья отображается в "Global Feed"', async ({ page }) => {
        // Переходим на страницу создания статьи
        await mainPage.clickArticleCreateLink();

        // Заполняем все поля при создании статьи
        await articleCreatePage.createAndPublishArticle(title, description, body, tags);

        // Переходим на главную страницу
        await mainPage.openMainPage();

        // Открываем таб "Global Feed"
        await mainPage.openGlobalFeed();

        // Получаем данные статьи из Global Feed
        const articleInFeed = await mainPage.getArticleByTitle(title);

        // Проверяем, что статья отображается в Global Feed
        expect(articleInFeed).not.toBeNull();
        expect(articleInFeed.title).toContain(title);
        expect(articleInFeed.author).toContain(user.name);
    })

    test('Проверка содержимого созданной статьи при просмотре', async () => {
        // Переходим на страницу создания статьи
        await mainPage.clickArticleCreateLink();

        // Создаем новую статью
        await articleCreatePage.createAndPublishArticle(title, description, body, tags);

        // Получаем данные статьи
        const articleData = await articleViewPage.getArticleData();

        // Проверяем содержимое статьи
        expect(articleData.title).toContain(title);

        // Нормализуем пробелы для сравнения содержания
        const normalizedActualBody = articleData.body.replace(/\s+/g, ' ').trim();
        const normalizedExpectedBody = body.replace(/\s+/g, ' ').trim();
        expect(normalizedActualBody).toContain(normalizedExpectedBody);

        // Проверяем теги
        for (const tag of tags) {
            expect(articleData.tags).toContain(tag);
        }

        // Проверяем автора
        expect(articleData.author).toContain(user.name);
    })

    test('Добавление комментария к статье', async () => {
        const comment = faker.lorem.sentence();

        // Переходим на страницу создания статьи
        await mainPage.clickArticleCreateLink();

        // Создаем новую статью
        await articleCreatePage.createAndPublishArticle(title, description, body, tags);

        // Получаем заголовок статьи и проверяем
        const articleTitle = await articleViewPage.getArticleTitle();
        expect(articleTitle).toContain(title);

        // Добавляем комментарий к статье
        await articleViewPage.addComment(comment);

        // Получаем данные комментария
        const commentData = await articleViewPage.getCommentData(comment);

        // Проверяем, что комментарий добавлен
        expect(commentData).not.toBeNull();
        expect(commentData.text).toContain(comment);
        expect(commentData.author).toContain(user.name);
    })

    test('Множественное добавление комментариев к статье', async () => {
        // Создаем массив из 3 комментариев
        const comments = Array.from({ length: 3 }, () => faker.lorem.sentence());

        // Переходим на страницу создания статьи
        await mainPage.clickArticleCreateLink();

        // Создаем новую статью
        await articleCreatePage.createAndPublishArticle(title, description, body, tags);

        // Получаем заголовок статьи и проверяем
        const articleTitle = await articleViewPage.getArticleTitle();
        expect(articleTitle).toContain(title);

        // Добавляем комментарии к статье
        for (let i = 0; i < comments.length; i++) {
            console.log(`Добавляем комментарий ${i + 1} из ${comments.length}`);
            await articleViewPage.addComment(comments[i]);
        }

        // Проверяем, что все комментарии присутствуют на странице
        for (const comment of comments) {
            const commentData = await articleViewPage.getCommentData(comment);
            expect(commentData).not.toBeNull();
            expect(commentData.text).toContain(comment);
            expect(commentData.author).toContain(user.name);
        }
    })
})