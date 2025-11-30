import { test, expect } from "@playwright/test";

//todo Нейминг теста
test("Пользователь может заказать бургер", async ({ page }) => {
  await page.goto("file:///Users/sniper/Downloads/burger-order.html");

  // разобраться почему так
  //Вариант 1
  //Поиск по роли
  await page.getByRole("textbox", { name: "Имя" }).click();
  // Поиск по плейсхолдеру
  // await page.getByPlaceholder("Введите ваше имя").click();
  // Связка ключ-значение или поиск по тегу
  await page.locator('[placeholder="Введите ваше имя"]').fill("Sniper");
  // Поиск по css id
  await page.locator("#burgerType").selectOption("cheeseburger");
  // Поиск по классу
  await page.locator(".radio-group", { hasText: "Большой" }).click();
  // Поиск по тексту
  //await page.getByText("Горчица").click();
  // Поиск по лейблу
  await page.getByLabel("Горчица").click();

  // Кликнуть по классу заказ с собой
  await page.locator(".switch-label").click();

  //Увеличить количество бургеров
  await page.getByText("+").click();

  //todo Не выбирает Картой-онлайн
  // Способ оплаты
  await page.locator(".radio-group", { hasText: "Картой онлайн" }).click();

  await page.getByText("Заказать бургер").click();
  await expect(page.getByText("✅ Заказ принят!")).toBeVisible();
  // todo
  await expect(page.locator("#popupMessage")).toContainText(
    "Спасибо за заказ, Sniper!",
  );
  //
  //
});
