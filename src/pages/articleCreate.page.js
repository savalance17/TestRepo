import { expect } from '@playwright/test';

export class ArticleCreatePage {
    // техническое описание страницы
    
    constructor(page) {
        this.page = page;
        this.titleInput = page.getByPlaceholder('Article Title');
        this.descriptionInput = page.getByPlaceholder("What's this article about?");
        this.bodyInput = page.getByPlaceholder('Write your article (in markdown)');
        this.tagInput = page.getByPlaceholder('Enter tags');
        this.publishButton = page.getByRole('button', { name: 'Publish Article' });
    }
    
    // бизнесовые действия со страницей
    
    /**
     * Заполнение тегов статьи
     * @param {string|string[]} tags - Теги статьи (строка с тегами через пробел или массив тегов)
     */
    async fillTags(tags) {
        console.log('Заполняем поле "Enter tags"');
        
        // Если передан массив, используем его, иначе разбиваем строку по пробелам
        const tagsArray = Array.isArray(tags) ? tags : tags.split(' ').filter(tag => tag.trim() !== '');
        
        if (tagsArray.length === 0) return;
        
        // Кликаем на поле ввода тегов
        await this.tagInput.click();
        
        // Вводим первый тег
        await this.tagInput.fill(tagsArray[0].trim());
        
        // Для остальных тегов: нажимаем пробел (чтобы добавить предыдущий тег) и вводим следующий тег
        for (let i = 1; i < tagsArray.length; i++) {
            const tag = tagsArray[i].trim();
            if (tag) {
                await this.tagInput.press('Space');
                await this.tagInput.type(tag);
            }
        }
    }

    /**
     * Заполнение полей при создании статьи
     * @param {string} title - Заголовок статьи
     * @param {string} description - Описание статьи
     * @param {string} body - Содержание статьи
     * @param {string|string[]} tags - Теги статьи (строка с тегами через пробел или массив тегов)
     */
    async fillArticleFields(title, description, body, tags) {
        console.log('Заполняем поля статьи');

        // Заполняем Заголовок статьи
        await this.titleInput.fill(title);
        console.log('Заполняем поле "Article Title"');
        await expect(this.titleInput).toHaveValue(title);

        // Заполняем Описание статьи
        console.log('Заполняем поле "What\'s this article about?"');
        await this.descriptionInput.fill(description);
        await expect(this.descriptionInput).toHaveValue(description);

        // Заполняем Содержание статьи
        console.log('Заполняем поле "Write your article (in markdown)"');
        await this.bodyInput.fill(body);
        await expect(this.bodyInput).toHaveValue(body);

        // Заполняем Теги статьи
        if (tags) {
            await this.fillTags(tags);
            // Проверяем теги: после заполнения они сохраняются через запятую
            const tagsArray = Array.isArray(tags) ? tags : tags.split(' ').filter(tag => tag.trim() !== '');
            const actualTagsValue = await this.tagInput.inputValue();
            
            // Проверяем, что каждый тег присутствует в поле
            for (const tag of tagsArray) {
                expect(actualTagsValue).toContain(tag.trim());
            }
        }
    }

    /**
     * Нажимаем кнопку "Publish Article"
     */
    async clickPublishButton() {
        console.log('Нажимаем кнопку "Publish Article"');
        await this.publishButton.click();
    }

    /**
     * Создание и публикация новой статьи
     * Объединяет заполнение полей и публикацию статьи
     * @param {string} title - Заголовок статьи
     * @param {string} description - Описание статьи
     * @param {string} body - Содержание статьи
     * @param {string|string[]} tags - Теги статьи (строка с тегами через пробел или массив тегов)
     */
    async createAndPublishArticle(title, description, body, tags) {
        console.log('Создаем и публикуем новую статью');
        
        // Заполняем все поля статьи
        await this.fillArticleFields(title, description, body, tags);
        
        // Публикуем статью
        await this.clickPublishButton();
        
        // Ждем загрузки страницы после публикации
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Проверка заполненных полей статьи
     * @param {string} expectedTitle - Ожидаемый заголовок статьи
     * @param {string} expectedDescription - Ожидаемое описание статьи
     * @param {string} expectedBody - Ожидаемое содержание статьи
     * @param {string|string[]} expectedTags - Ожидаемые теги статьи (строка с тегами через пробел или массив тегов)
     */
    async checkFilledFields(expectedTitle, expectedDescription, expectedBody, expectedTags) {
        console.log('Проверяем заполненные поля статьи');

        // Проверяем заголовок
        if (expectedTitle) {
            console.log(`Проверяем заголовок: "${expectedTitle}"`);
            await expect(this.titleInput).toHaveValue(expectedTitle);
        }

        // Проверяем описание
        if (expectedDescription) {
            console.log(`Проверяем описание: "${expectedDescription}"`);
            await expect(this.descriptionInput).toHaveValue(expectedDescription);
        }

        // Проверяем содержание
        if (expectedBody) {
            console.log('Проверяем содержание статьи');
            await expect(this.bodyInput).toHaveValue(expectedBody);
        }

        // Проверяем теги
        if (expectedTags) {
            console.log('Проверяем теги статьи');
            const tagsArray = Array.isArray(expectedTags) ? expectedTags : expectedTags.split(' ').filter(tag => tag.trim() !== '');
            const actualTagsValue = await this.tagInput.inputValue();
            
            // Проверяем, что каждый тег присутствует в поле
            for (const tag of tagsArray) {
                expect(actualTagsValue).toContain(tag.trim());
            }
        }
    }
}