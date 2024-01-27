const express = require('express');
const inquirer = require('inquirer');
const app = express();
const PORT = process.env.PORT || 3000;

// const path = require('path');

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});