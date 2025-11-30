import { test, expect } from "@playwright/test";
//todo Нейминг теста

// Роль действие интерфейс

test("Аноним может создать задачу", async ({ page }) => {
  // Arrange Предусловие
  await page.goto("https://todomvc.com/examples/vue/dist/#/");

  // Act Шаги
  await page
    .getByRole("textbox", { name: "What needs to be done?" })
    .fill("Скажи-ка дядя ведь недаром");
  await page
    .getByRole("textbox", { name: "What needs to be done?" })
    .press("Enter");

  // Assert Проверка
  await expect(page.getByText("Скажи-ка дядя ведь недаром")).toBeVisible();
  await expect(page.getByRole("main")).toContainText(
    "Скажи-ка дядя ведь недаром",
  );

  await expect(page.getByText("navigation")).toContainText("sniper10112025");

  //todo Добавить проверку на отображение каунтера

  /*
    Многострочный комментарий
  */
});
