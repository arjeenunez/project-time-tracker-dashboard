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

    const cardTextContainer = createContainer('div', 'card-text-container');

    const cardHours = createText('h2', currentHours, 'card-hours');
    const cardText = createText('span', pastHours, 'card-text');

    cardTextContainer.append(cardHours);
    cardTextContainer.append(cardText);

    metricCard.append(cardHeader);
    metricCard.append(cardTextContainer);
    metricsMetric.append(metricImg);
    metricsMetric.append(metricCard);
    return metricsMetric;
};

const hrsText = function (value) {
    return value === 1 ? 'hr' : 'hrs';
};

const loadData = function (data, duration = 'daily') {
    const dashboardMetrics = document.querySelector('.dashboard-metrics');
    dashboardMetrics.innerHTML = '';

    const getPreviousLabel = duration => {
        if (duration === 'daily') return 'Yesterday - ';
        if (duration === 'weekly') return 'Last Week - ';
        if (duration === 'monthly') return 'Last Month - ';
        return '';
    };

    data.forEach(item => {
        const { title, timeframes } = item;
        const currentVal = timeframes[duration]?.current ?? 0;
        const previousVal = timeframes[duration]?.previous ?? 0;
        const current = `${currentVal}${hrsText(currentVal)}`;
        const previous = `${getPreviousLabel(duration)}${previousVal}${hrsText(previousVal)}`;
        const foundKey = scheme.find(el => el.key === title.toLowerCase());
        if (!foundKey) return;
        const metric = createMetric(title, current, previous, `var(${foundKey.color})`, foundKey.add);
        dashboardMetrics.append(metric);
    });
};

const renderData = async function () {
    const data = await getData();
    loadData(data);

    const dashboardProfile = document.querySelector('.dashboard-profile');
    dashboardProfile.addEventListener('click', function (evt) {
        const links = this.querySelectorAll('.links-link');
        if (evt.target.classList.contains('links-link')) {
            links.forEach(link => link.classList.toggle('active', link.textContent === evt.target.textContent));
            let duration = evt.target.textContent.toLowerCase();
            loadData(data, duration);
        }
    });
};

renderData();
