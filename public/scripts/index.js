'use strict';

const scheme = [
    { key: 'work', color: '--color-work', add: './public/assets/icon-work.svg' },
    { key: 'play', color: '--color-play', add: './public/assets/icon-play.svg' },
    { key: 'study', color: '--color-study', add: './public/assets/icon-study.svg' },
    { key: 'exercise', color: '--color-exercise', add: './public/assets/icon-exercise.svg' },
    { key: 'social', color: '--color-social', add: './public/assets/icon-social.svg' },
    { key: 'self care', color: '--color-self-care', add: './public/assets/icon-self-care.svg' },
];

const getData = async function () {
    const response = await fetch('./data.json');
    const resJson = await response.json();
    return resJson;
};

const createContainer = function (element, className) {
    const container = document.createElement(element);
    container.classList.add(className);
    return container;
};

const createText = function (element, text, className) {
    const textElement = document.createElement(element);
    textElement.textContent = text;
    if (className) {
        textElement.classList.add(className);
    }
    return textElement;
};

const createImage = function (src, alt, className) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    if (className) {
        img.classList.add(className);
    }
    return img;
};

const ellipsis = function () {
    const ellipsisContainer = createContainer('div', 'ellipsis');
    for (let i = 0; i < 3; i++) {
        const dot = createContainer('div', 'dot');
        ellipsisContainer.appendChild(dot);
    }
    return ellipsisContainer;
};

const createMetric = function (title, currentHours, pastHours, color, iconSrc) {
    const metricsMetric = createContainer('div', `metrics-metric`);
    metricsMetric.style.backgroundColor = color;

    const metricCard = createContainer('div', 'metric-card');
    const metricImg = createImage(iconSrc, title.toLowerCase(), 'metric-img');

    const cardHeader = createContainer('div', 'card-header');
    const cardTitle = createText('h3', title[0].toUpperCase() + title.slice(1));
    const ellipsisContainer = ellipsis();
    cardHeader.append(cardTitle);
    cardHeader.append(ellipsisContainer);

    const cardHours = createText('h2', `${currentHours}hrs`, 'card-hours');
    const cardText = createText('span', `Last Week - ${pastHours}hrs`, 'card-text');

    metricCard.append(cardHeader);
    metricCard.append(cardHours);
    metricCard.append(cardText);
    metricsMetric.append(metricImg);
    metricsMetric.append(metricCard);
    return metricsMetric;
};

const renderData = async function () {
    const data = await getData();
    const dashboardMetrics = document.querySelector('.dashboard-metrics');
    data.forEach(item => {
        const foundKey = scheme.find(el => el.key === item.title.toLowerCase());
        const metric = createMetric(item.title, item.timeframes.weekly.current, item.timeframes.weekly.previous, `var(${foundKey.color})`, foundKey.add);
        dashboardMetrics.append(metric);
    });
    console.log(data);
};

renderData();
