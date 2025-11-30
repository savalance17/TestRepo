import { expect } from '@playwright/test';
import TaskViewLayout from '../pageObjects/cards/Tasks/TaskViewLayout';
import DocumentViewLayout from '../pageObjects/cards/Documents/DocumentViewLayout';
import ApprovalSidePanel from '../pageObjects/components/SidePanels/ApprovalSidePanel';
import RemarkSidePanel from '../pageObjects/components/SidePanels/RemarkSidePanel';
import SignForm from '../pageObjects/components/SignForm';
import ModalWindow from '../pageObjects/components/ModalWindow';
import ConfirmationModalWindow from '../pageObjects/components/ConfirmationModalWindow';
import ExtraApproversSidePanel from '../pageObjects/components/SidePanels/ExtraApproversSidePanel';
import DashboardLayout from '../pageObjects/WebFrame/DashboardLayout';
import MainMenuSidebar from '../pageObjects/WebFrame/MainMenuSidebar';
import FolderLayout from '../pageObjects/WebFrame/FolderLayout';
import GroupingSidePanel from '../pageObjects/components/SidePanels/GroupingSidePanel';
import CreateFolderDialog from '../pageObjects/components/Windows/CreateFolderWindow';
import UserProfileLayout from '../pageObjects/components/UserProfileLayout';
import { waitForLoadingToHide } from './utils';

/**
 * Открывает профиль пользователя из дашборда и проверяет, что он открыт
 * Если профиль уже открыт, то пропускает открытие
 */
export async function openUserProfile(page) {
    const dashboard = new DashboardLayout(page);
    const userProfileLayout = new UserProfileLayout(page);

    // Сначала проверяем, не открыт ли уже профиль пользователя
    console.log('Проверяем, не открыт ли уже профиль пользователя...');
    
    try {
        const isProfileVisible = await userProfileLayout.checkUserProfileIsVisible(false);
        if (isProfileVisible) {
            console.log('Профиль пользователя уже открыт, пропускаем открытие');
            return;
        }
    } catch (error) {
        console.log('Профиль пользователя не открыт, продолжаем открытие');
    }

    // Открываем меню пользователя
    console.log('Открываем меню пользователя');
    await dashboard.clickUserMenuButton();

    // Открываем профиль пользователя
    console.log('Открываем профиль пользователя');
    await dashboard.clickUserProfileButton();

    // Дожидаемся завершения загрузки 
    await waitForLoadingToHide(page);

    // Проверяем, что профиль пользователя открыт
    await userProfileLayout.checkUserProfileIsVisible(true);
}

/**
 * Очищает всех заместителей у пользователя
 * @param {boolean} needReload - нужно ли выполнять релоад страницы (по умолчанию false)
 */
export async function cleanupUserDeputies(page, needReload = false) {
    const userProfileLayout = new UserProfileLayout(page);
    const confirmationModalWindow = new ConfirmationModalWindow(page);
    const dashboard = new DashboardLayout(page);
    
    try {
        console.log(`Начинаем очистку заместителей`);

        // Перезагружаем страницу только если нужно
        if (needReload) {
            console.log('Выполняем релоад страницы');
            await page.reload();
            await waitForLoadingToHide(page);
        } else {
            console.log('Пропускаем релоад страницы');
        }
        
        // Открываем профиль пользователя
        await openUserProfile(page);
        
        // Получаем список всех заместителей
        const deputies = await userProfileLayout.getAllDeputies();
        
        if (deputies.length > 0) {
            console.log(`Найдено заместителей для удаления: ${deputies.length}`);
            
            // Удаляем каждого заместителя
            for (const deputy of deputies) {
                try {
                    console.log(`Удаляем заместителя: ${deputy}`);
                    await userProfileLayout.removeDeputy(deputy);
                    
                    // Подтверждаем удаление
                    await confirmationModalWindow.checkConfirmationModalWindow('Вы действительно хотите удалить строку?');
                    await confirmationModalWindow.clickConfirmationModalOkButton();
                    
                } catch (error) {
                    console.log(`Ошибка при удалении заместителя ${deputy}:`, error.message);
                }
            }
            
        } else {
            console.log('Заместители не найдены');
        }
        
        // Сохраняем изменения
        await userProfileLayout.clickSaveButton();
        console.log('Все заместители удалены и изменения сохранены');
        
    } catch (error) {
        console.log('Ошибка при очистке заместителей:', error.message);
    }
}

/**
 * Очищает все поля комментариев в профиле пользователя
 * @param {boolean} needReload - Нужно ли перезагружать страницу
 */
export async function cleanupSignatureComments(page, needReload = false) {
    const userProfileLayout = new UserProfileLayout(page);
    
    try {
        console.log(`Начинаем очистку комментариев в профиле пользователя`);

        // Перезагружаем страницу только если нужно
        if (needReload) {
            console.log('Выполняем релоад страницы');
            await page.reload();
            await waitForLoadingToHide(page);
        } else {
            console.log('Пропускаем релоад страницы');
        }
        
        // Открываем профиль пользователя
        await openUserProfile(page);
        
        // Переходим на вкладку "Подпись"
        await userProfileLayout.openSignatureOptionsTab();
        
        // Получаем список всех сертификатов
        const certificates = await userProfileLayout.getAllCertificateNames();
        
        if (certificates.length > 0) {
            console.log(`Найдено сертификатов для очистки комментариев: ${certificates.length}`);
            
            // Очищаем комментарии для каждого сертификата
            for (const certificate of certificates) {
                try {
                    console.log(`Очищаем комментарий для сертификата: ${certificate}`);
                    await userProfileLayout.fillCommentField(certificate, '');
                    
                } catch (error) {
                    console.log(`Ошибка при очистке комментария для сертификата ${certificate}:`, error.message);
                }
            }
            
        } else {
            console.log('Сертификаты не найдены');
        }
        
        // Сохраняем изменения
        await userProfileLayout.clickSaveButton();
        console.log('Все комментарии очищены и изменения сохранены');
        
    } catch (error) {
        console.log('Ошибка при очистке комментариев:', error.message);
    }
}

/**
 * Устанавливает состояние чекбоксов для всех сертификатов в профиле пользователя
 * @param {Page} page - Объект страницы Playwright
 * @param {boolean} state - Состояние чекбокса (true - установлен, false - снят)
 * @param {boolean} needReload - Нужно ли перезагружать страницу
 */
export async function setCertificatesCheckboxState(page, state = true, needReload = false) {
    const userProfileLayout = new UserProfileLayout(page);
    
    try {
        console.log(`Начинаем установку состояния чекбоксов сертификатов: ${state ? 'активен' : 'неактивен'}`);

        // Перезагружаем страницу только если нужно
        if (needReload) {
            console.log('Выполняем релоад страницы');
            await page.reload();
            await waitForLoadingToHide(page);
        } else {
            console.log('Пропускаем релоад страницы');
        }
        
        // Открываем профиль пользователя
        await openUserProfile(page);
        
        // Переходим на вкладку "Подпись"
        await userProfileLayout.openSignatureOptionsTab();
        
        // Получаем список всех сертификатов
        const certificates = await userProfileLayout.getAllCertificateNames();
        
        if (certificates.length > 0) {
            console.log(`Найдено сертификатов для установки чекбоксов: ${certificates.length}`);
            
            // Устанавливаем состояние чекбокса для каждого сертификата
            for (const certificate of certificates) {
                try {
                    // Пропускаем "Простая подпись (без сертификата)", так как она всегда активна и заблокирована
                    if (certificate === 'Простая подпись (без сертификата)') {
                        console.log(`Пропускаем сертификат "${certificate}" - он всегда активен и заблокирован`);
                        continue;
                    }
                    
                    console.log(`Устанавливаем состояние чекбокса для сертификата "${certificate}": ${state ? 'активен' : 'неактивен'}`);
                    await userProfileLayout.setCertificateCheckbox(certificate, state);
                    
                } catch (error) {
                    console.log(`Ошибка при установке чекбокса для сертификата "${certificate}":`, error.message);
                }
            }
            
        } else {
            console.log('Сертификаты не найдены');
        }
        
        // Сохраняем изменения
        await userProfileLayout.clickSaveButton();
        console.log(`Состояние чекбоксов всех сертификатов установлено: ${state ? 'активен' : 'неактивен'}, изменения сохранены`);
        
    } catch (error) {
        console.log('Ошибка при установке состояния чекбоксов сертификатов:', error.message);
    }
}

/**
 * Возвращает статус пользователя к исходному состоянию "Активен"
 * 
 * @param {Page} page - Объект страницы Playwright
 * @param {string} currentStatus - Текущий статус пользователя, который нужно изменить
 * @param {string} targetStatus - Целевой статус (по умолчанию "Активен")
 * 
 * @example
 * // Вернуть статус "Активен" после теста со статусом "Болен"
 * await restoreUserStatus(page, 'Болен');
 * 
 * @example
 * // Вернуть конкретный статус
 * await restoreUserStatus(page, 'В отпуске', 'Активен');
 */
export async function restoreUserStatus(page, initialStatus = 'Активен', needReload = false) {
    const dashboard = new DashboardLayout(page);
    const userProfileLayout = new UserProfileLayout(page);
    
    try {
        console.log(`Возвращаем статус "${initialStatus}"`);

        // Перезагружаем страницу только если нужно
        if (needReload) {
            console.log('Выполняем релоад страницы');
            await page.reload();
            await waitForLoadingToHide(page);
        } else {
            console.log('Пропускаем релоад страницы');
        }
        
        // Открываем профиль пользователя
        await openUserProfile(page);
        
        // Изменяем статус на целевой
        await userProfileLayout.changeUserStatus(initialStatus);
        
        // Сохраняем изменения
        await userProfileLayout.clickSaveButton();
        
        // Проверяем, что цвет точки статуса изменился (для статуса "Активен" - зеленый)
        if (initialStatus === 'Активен') {
            await dashboard.checkUserStatusPointColor('green');
        }
        
        console.log(`Статус успешно возвращен на "${initialStatus}"`);
        
    } catch (error) {
        console.log(`Ошибка при возврате статуса "${initialStatus}":`, error.message);
        throw error;
    }
}

