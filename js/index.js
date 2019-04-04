// Select question span (the span in the h1 element)
const question = document.querySelector('.question__span')

// Select all color blocks
const colorBlocks = document.querySelectorAll('.colors__color')

// Select the reset button (in the panel div)
const resetButton = document.querySelector('.panel__reset')

// Select attempts div (in the panel div)
const attemptsLeftDiv = document.querySelector('.panel__attempts')
let attemptsLeft = 3

// Select check div (in the panel div)
const checkAnswer = document.querySelector('.panel__check')

// Generate a random value for a RGB Color
const generateRGBValue = () => {
    return Math.floor(Math.random() * 256)
}

// Generate a random RGB Color
const generateRandomColor = () => {
    return `rgb(${generateRGBValue()}, ${generateRGBValue()}, ${generateRGBValue()})`
}

// Give color blocks a random background color
const fillColorBlocks = () => {
    for (let block of colorBlocks) block.style.backgroundColor = generateRandomColor()
}

// Push all background colors into a new array
const generateColorArray = () => {
    const colors = []
    for (let block of colorBlocks) colors.push(block.style.backgroundColor)
    return colors
}

// Check if a color is twice (or more) in the colors array
const checkDoubleColors = () => {
    const colors = generateColorArray().sort()
    colors.forEach((color, index) => {
        if(color === colors[index + 1]) startGame()
    })
}

// Pick RGB color from the colors array. The chosen one will be the correct answer
const pickColorForQuestion = () => {
    const colors = generateColorArray()
    const index = Math.floor(Math.random() * 6)
    question.textContent = colors[index]
}

// Insert number of attempts
const setAttempts = () => {
    attemptsLeftDiv.textContent = `Aantal pogingen resterend: ${attemptsLeft}`
}

// Start new game
const startGame = () => {
    fillColorBlocks()
    checkDoubleColors()
    pickColorForQuestion()
    setAttempts()
}

startGame()

// Revert to default styles from CSS stylesheet
const revertStyle = () => {
    colorBlocks.forEach(block => {
        block.classList.remove('colors__color--correct', 'colors__color--other-answer', 'colors__color--wrong')
        block.innerHTML = ''
    })
    checkAnswer.classList.remove('panel__check--win', 'panel__check--lost')
}

// Reset Game
const resetGame = () => {
    revertStyle()
    resetButton.textContent = 'Reset'
    attemptsLeft = 3
    checkAnswer.textContent = ''
    startGame()
}

// EventListener for when the reset button is clicked
resetButton.addEventListener('click', resetGame)

// Show answers (when guessed correct, or when no attempts left)
const showAnswers = block => {
    if(block.style.backgroundColor === question.textContent) {
        block.classList.add('colors__color--correct')
        const colorValueDiv = document.createElement('div')
        colorValueDiv.textContent = block.style.backgroundColor
        colorValueDiv.classList.add('colors__value', 'colors__value--correct')
        block.appendChild(colorValueDiv)
    } else {
        block.classList.remove('colors__color--wrong')
        block.classList.add('colors__color--other-answer')
        const colorValueDiv = document.createElement('div')
        colorValueDiv.textContent = block.style.backgroundColor
        colorValueDiv.classList.add('colors__value')
        block.appendChild(colorValueDiv)
    }
}

// EventListener for when a color block is clicked
colorBlocks.forEach(block => {
    block.addEventListener('click', function(event) {
        if (attemptsLeft > 0) {
            if (block.style.backgroundColor === question.textContent) {
                colorBlocks.forEach(block => {
                    showAnswers(block)                    
                })
                resetButton.textContent = 'Win nog een keer!'
                attemptsLeftDiv.textContent = ''
                checkAnswer.textContent = 'Dat is het juiste antwoord! Goed gedaan!'
                checkAnswer.classList.add('panel__check--win')
            } else {
                block.classList.add('colors__color--wrong')
                attemptsLeft--
                setAttempts()
                checkAnswer.textContent = 'Dat is helaas niet het juiste antwoord! Probeer het nog een keer!'
                if (attemptsLeft === 0) {
                    colorBlocks.forEach(block => {
                        showAnswers(block)
                    })
                    resetButton.textContent = 'Waag een nieuwe poging!'
                    attemptsLeftDiv.textContent = ''
                    checkAnswer.textContent = 'Je bent uitgeschakeld! Zie hierboven wat het juiste antwoord was'
                    checkAnswer.classList.add('panel__check--lost')
                }
            }
        }        
    })
})