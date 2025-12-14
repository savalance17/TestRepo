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

        // Заполняем Описание статьи
        console.log('Заполняем поле "What\'s this article about?"');
        await this.descriptionInput.fill(description);

        // Заполняем Содержание статьи
        console.log('Заполняем поле "Write your article (in markdown)"');
        await this.bodyInput.fill(body);

        // Заполняем Теги статьи
        if (tags) {
            await this.fillTags(tags);
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

}