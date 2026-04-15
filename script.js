const EMOJIS_SET = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼']

class MemoryGame {
  constructor() {
    this.gridContainer = document.getElementById('memoryGrid')
    this.movesSpan = document.getElementById('movesCount')
    this.winMessageDiv = document.getElementById('winMessage')
    this.resetBtn = document.getElementById('resetGameBtn')

    this.cards = []
    this.flippedCards = []
    this.moves = 0
    this.matchedPairs = 0
    this.isLocked = false

    this.init()
  }

  init() {
    this.moves = 0
    this.matchedPairs = 0
    this.flippedCards = []
    this.isLocked = false
    this.cards = [...EMOJIS_SET, ...EMOJIS_SET]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, isMatched: false }))

    this.render()
    this.setupEventListeners()
  }

  render() {
    this.movesSpan.textContent = this.moves
    this.winMessageDiv.innerHTML = ''
    this.gridContainer.innerHTML = ''

    this.cards.forEach((card) => {
      const cardEl = document.createElement('div')
      cardEl.classList.add('card')
      cardEl.dataset.id = card.id

      cardEl.innerHTML = `
        <div class="card-inner">
          <div class="card-front"></div>
          <div class="card-back">${card.emoji}</div>
        </div>
      `
      this.gridContainer.appendChild(cardEl)
    })
  }

  setupEventListeners() {
    this.gridContainer.onclick = (e) => {
      const cardEl = e.target.closest('.card')
      if (cardEl) this.handleCardClick(cardEl)
    }
    this.resetBtn.onclick = () => this.init()
  }

  handleCardClick(cardEl) {
    const id = parseInt(cardEl.dataset.id)
    const card = this.cards[id]

    if (this.isLocked || card.isMatched || cardEl.classList.contains('flipped'))
      return

    cardEl.classList.add('flipped')
    this.flippedCards.push({ card, el: cardEl })

    if (this.flippedCards.length === 2) {
      this.moves++
      this.movesSpan.textContent = this.moves
      this.checkMatch()
    }
  }

  checkMatch() {
    this.isLocked = true
    const [obj1, obj2] = this.flippedCards

    if (obj1.card.emoji === obj2.card.emoji) {
      obj1.el.classList.add('matched')
      obj2.el.classList.add('matched')
      obj1.card.isMatched = true
      obj2.card.isMatched = true
      this.matchedPairs++
      this.flippedCards = []
      this.isLocked = false
      if (this.matchedPairs === EMOJIS_SET.length) this.showWin()
    } else {
      setTimeout(() => {
        obj1.el.classList.remove('flipped')
        obj2.el.classList.remove('flipped')
        this.flippedCards = []
        this.isLocked = false
      }, 1000)
    }
  }

  showWin() {
    this.winMessageDiv.innerHTML = `
      <div style="background:#d4e6b0; border-radius:50px; padding:12px 25px; font-weight:bold; color:#2b5e1a; animation: pulse 1s infinite;">
        VICTORIA! COMPLETADO EN ${this.moves} INTENTOS
      </div>`
  }
}

document.addEventListener('DOMContentLoaded', () => new MemoryGame())
