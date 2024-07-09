
import { browser, by, element, ExpectedConditions as EC } from 'protractor';
import { protractor } from 'protractor/built/ptor';

describe('Agregar y Detalle flow', () => {
    it('should create a new activity and validate it on detail page', async () => {
        console.log("Navegando a /agregar");
        await browser.get('/agregar');
        await browser.sleep(10000);
        console.log("Rellenando descripción");
        var desc = element(by.css('ion-input[ng-reflect-name="inputDescripcion"] input'));
        desc.sendKeys("Desayuno");
        console.log("Rellenando descripción después");
        await browser.sleep(4000);
        console.log("Guardando nueva actividad");
        let EC = browser.ExpectedConditions;
        let btn = element(by.css('ion-button#guardarBtn'));
        await btn.isPresent().then((present) => console.log('Is present:', present));
        await btn.isDisplayed().then((visible) => console.log('Is visible:', visible));
        await btn.isEnabled().then((enabled) => console.log('Is enabled:', enabled));
        try {
            await browser.wait(EC.elementToBeClickable(btn), 10000);
            await btn.click();
        } catch (error) {
            console.log('Error clicking #guardarBtn:', error);
        }
        console.log("Esperando redirección");
        await browser.sleep(10000);
        console.log("Comprobando detalles de la actividad");
        expect(await element(by.css('ion-card-title')).getText()).toEqual('Desayuno');

    });
});

