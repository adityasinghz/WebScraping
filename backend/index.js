const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/quotes', async (req, res) => {
    try {
        const quotes = await fetchDolarBlue();
        res.send(quotes);
    } catch (error) {
        console.error('Error fetching quotes:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/average', async (req, res) => {
    try {
        const quotes = await fetchAllQuotes();
        res.send(quotes);
    } catch (error) {
        console.error('Error fetching quotes:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function fetchAllQuotes() {
    const browser = await puppeteer.launch({ headless: true, defaultViewport: null });
    const page = await browser.newPage();

    const quotes = [];
    let sellAvg = 0;
    let buyAvg = 0;
    let total_currencies = 0;
    await page.goto('https://www.ambito.com/contenidos/dolar.html', { waitUntil: 'networkidle2', timeout: 0 });
    await page.waitForSelector('.variation-max-min');
    const quoteElements = await page.$$('.variation-max-min');
    for (const quoteElement of quoteElements) {
        const buyPriceElement = await quoteElement.$('.variation-max-min__value.data-valor.data-compra');
        const sellPriceElement = await quoteElement.$('.variation-max-min__value.data-valor.data-venta');
        // Check if buyPriceElement and sellPriceElement are not null before extracting data
        if (buyPriceElement && sellPriceElement) {
            const buyPrice = await (await buyPriceElement.getProperty('textContent')).jsonValue();
            const sellPrice = await (await sellPriceElement.getProperty('textContent')).jsonValue();
            const compraNumber = parseFloat(buyPrice.replace(',', '.'));
            const ventaNumber = parseFloat(sellPrice.replace(',', '.'));
            buyAvg += compraNumber;
            sellAvg += ventaNumber;
            total_currencies++;
        }
    }
    quotes.push({ title: 'Average Positions Of All The Quotes', buy_price: parseFloat((buyAvg / total_currencies).toFixed(2)), sell_price: parseFloat((sellAvg / total_currencies).toFixed(2)), source: 'https://www.ambito.com/contenidos/dolar.html' });
    await browser.close();
    return quotes;
}


async function fetchDolarBlue() {
    const browser = await puppeteer.launch({ headless: true, defaultViewport: null });
    const quotes = [];

    try {
        await fetchQuotesAmbito(browser, quotes);
        await fetchQuotesDolarHoy(browser, quotes);
        await fetchQuotesCronista(browser, quotes);
    } catch (error) {
        console.error('Error fetching quotes:', error);
    } finally {
        await browser.close();
    }

    return quotes;
}

async function fetchQuotesAmbito(browser, quotes) {
    const page = await browser.newPage();
    await page.goto('https://www.ambito.com/contenidos/dolar.html', { waitUntil: 'networkidle2', timeout: 0 });
    await page.waitForSelector('.variation-max-min');
    const quoteElement = await page.$('.variation-max-min');
    const title = await quoteElement.$eval('.variation-max-min__title', element => element.textContent.trim());
    if (title === 'Dólar Blue') {
        const buyPriceElement = await quoteElement.$('.variation-max-min__value.data-valor.data-compra');
        const sellPriceElement = await quoteElement.$('.variation-max-min__value.data-valor.data-venta');
        if (buyPriceElement && sellPriceElement) {
            const buyPrice = await (await buyPriceElement.getProperty('textContent')).jsonValue();
            const sellPrice = await (await sellPriceElement.getProperty('textContent')).jsonValue();
            const compraNumber = parseFloat(buyPrice.replace(',', '.'));
            const ventaNumber = parseFloat(sellPrice.replace(',', '.'));
            quotes.push({ title: title, buy_price: compraNumber, sell_price: ventaNumber, source: 'https://www.ambito.com/contenidos/dolar.html' });
        }
    }
    await page.close();
}

async function fetchQuotesDolarHoy(browser, quotes) {
    const page = await browser.newPage();
    await page.goto('https://www.dolarhoy.com/');
    await page.waitForSelector('.tile');
    const compraValue = await page.$eval('.tile .compra .val', element => element.textContent);
    const ventaValue = await page.$eval('.tile .venta .val', element => element.textContent);
    const compraNumber = parseFloat(compraValue.replace('$', '').trim());
    const ventaNumber = parseFloat(ventaValue.replace('$', '').trim());
    quotes.push({ buy_price: compraNumber, sell_price: ventaNumber, source: 'https://www.dolarhoy.com/' });
    await page.close();
}

async function fetchQuotesCronista(browser, quotes) {
    const page = await browser.newPage();
    try {
        await page.goto('https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB');
        await page.waitForSelector('#market-scrll-1');
        const compraValue = await page.$eval('.buy-value', element => element.textContent.trim());
        const ventaValue = await page.$eval('.sell-value', element => element.textContent.trim());
        const compraNumber = parseFloat(compraValue.replace('$', '').trim());
        const ventaNumber = parseFloat(ventaValue.replace('$', '').trim());
        quotes.push({ buy_price: compraNumber, sell_price: ventaNumber, source: 'https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB' });
    } catch (error) {
        console.error('Error fetching quotes:', error);
    } finally {
        await page.close();
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
