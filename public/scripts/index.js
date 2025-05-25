'use strict';

const getData = async function () {
    const response = await fetch('./data.json');
    const resJson = await response.json();
    console.log(resJson);
};
