import { expect } from '@playwright/test';

// Страница просмотра статьи
export class ArticleViewPage {
    constructor(page) {
        this.page = page;
        this.articleTitle = page.locator('.article-page .banner h1');
        this.articleContent = page.locator('.article-content');
        this.articleBody = page.locator('.article-content p');
        this.tagList = page.locator('.tag-list');
        this.tagItems = page.locator('.tag-list li');
        // Автор статьи в баннере (не автор комментария внизу)
        this.author = page.locator('.banner .article-meta .author');
        // Кнопка удаления статьи в баннере
        this.deleteArticleButton = page.locator('.banner').getByRole('button', { name: 'Delete Article' });
        // Поле для ввода комментария
        this.commentInput = page.getByPlaceholder('Write a comment...');
        // Кнопка отправки комментария
        this.postCommentButton = page.getByRole('button', { name: 'Post Comment' });
        // Контейнер со списком комментариев
        this.commentsContainer = page.locator('.card.comment-form').locator('..');
    }

    /**
     * Проверка, что статья открыта по названию
     * @param {string} expectedTitle - Ожидаемое название статьи
     */
    async checkArticleIsOpenedByTitle(expectedTitle) {
        console.log(`Проверяем, что статья с названием "${expectedTitle}" открыта`);
        await expect(this.articleTitle).toBeVisible();
        await expect(this.articleTitle).toContainText(expectedTitle);
    }

    /**
     * Проверка всех заполненных полей статьи
     * @param {string} expectedTitle - Ожидаемое название статьи
     * @param {string} expectedBody - Ожидаемое содержание статьи
     * @param {string[]} expectedTags - Ожидаемые теги статьи
     * @param {string} expectedAuthor - Ожидаемый автор статьи (опционально)
     */
    async checkAllArticleFields(expectedTitle, expectedBody, expectedTags, expectedAuthor = null) {
        console.log('Проверяем все поля статьи');

        // Проверяем заголовок
        console.log(`Проверяем заголовок: "${expectedTitle}"`);
        await expect(this.articleTitle).toBeVisible();
        await expect(this.articleTitle).toContainText(expectedTitle);

        // Проверяем содержание статьи
        if (expectedBody) {
            console.log('Проверяем содержание статьи');
            await expect(this.articleBody).toBeVisible();
            // Получаем текст и нормализуем пробелы для более гибкого сравнения
            const actualText = await this.articleBody.textContent();
            const normalizedActual = actualText.replace(/\s+/g, ' ').trim();
            const normalizedExpected = expectedBody.replace(/\s+/g, ' ').trim();
            expect(normalizedActual).toContain(normalizedExpected);
        }

        // Проверяем теги
        if (expectedTags && expectedTags.length > 0) {
            console.log(`Проверяем теги: ${expectedTags.join(', ')}`);
            await expect(this.tagList).toBeVisible();
            
            // Проверяем каждый тег
            for (const tag of expectedTags) {
                const tagLocator = this.tagList.locator(`li:has-text("${tag}")`);
                await expect(tagLocator).toBeVisible();
            }
        }

        // Проверяем автора
        if (expectedAuthor) {
            console.log(`Проверяем автора: "${expectedAuthor}"`);
            await expect(this.author).toBeVisible();
            await expect(this.author).toContainText(expectedAuthor);
        }
    }

    /**
     * Заполнение и отправка комментария
     * @param {string} commentText - Текст комментария
     */
    async addComment(commentText) {
        console.log(`Добавляем комментарий: "${commentText}"`);

        // Заполняем поле для ввода комментария
        await expect(this.commentInput).toBeVisible();
        await this.commentInput.fill(commentText);

        // Нажимаем кнопку "Post Comment"
        await expect(this.postCommentButton).toBeVisible();
        await this.postCommentButton.click();

        // Ждем появления комментария на странице
        await this.page.waitForLoadState('domcontentloaded');
        console.log('Комментарий отправлен');
    }

    /**
     * Проверка существования или отсутствия комментария
     * @param {string} expectedCommentText - Ожидаемый текст комментария
     * @param {boolean} shouldExist - true - проверяем наличие, false - проверяем отсутствие
     * @param {string} expectedAuthor - Ожидаемый автор комментария (опционально, только если shouldExist = true)
     */
    async checkComment(expectedCommentText, shouldExist = true, expectedAuthor = null) {
        const commentTextLocator = this.page.locator('.card-block p.card-text').filter({ hasText: expectedCommentText });
        
        if (shouldExist) {
            console.log(`Проверяем наличие комментария: "${expectedCommentText}"`);
            await expect(commentTextLocator).toBeVisible();
            
            // Если указан автор, проверяем его тоже
            if (expectedAuthor) {
                console.log(`Проверяем автора комментария: "${expectedAuthor}"`);
                // Ищем карточку комментария и автора в ней
                const commentCard = commentTextLocator.locator('..').locator('..');
                const authorLocator = commentCard.locator('.card-footer').getByText(expectedAuthor);
                await expect(authorLocator.first()).toBeVisible();
            }
            
            console.log('Комментарий найден и проверен');
        } else {
            console.log(`Проверяем, что комментарий "${expectedCommentText}" не существует`);
            await expect(commentTextLocator).not.toBeVisible();
            console.log('Комментарий не найден, проверка пройдена');
        }
    }
}

