export const check = (guess, solution) => {
  const splitSolution = solution.split('')
  const splitGuess = guess.split('')

  const solutionCharsTaken = splitSolution.map((_) => false)

  const statuses = Array.from(Array(guess.length));

  /*
   Correct Cases
  */

  splitGuess.forEach((letter, i) => {
    if (letter === splitSolution[i]) {
      statuses[i] = '0'
      solutionCharsTaken[i] = true
      return
    }
  })

  /*
   Absent Cases
  */

  splitGuess.forEach((letter, i) => {
    if (statuses[i]) return

    if (!splitSolution.includes(letter)) {
      statuses[i] = '2'
      return
    }

    /*
    Present Cases
    */

    const indexOfPresentChar = splitSolution.findIndex(
      (x, index) => x === letter && !solutionCharsTaken[index]
    )

    if (indexOfPresentChar > -1) {
      statuses[i] = '1'
      solutionCharsTaken[indexOfPresentChar] = true
      return
    } else {
      statuses[i] = '2'
      return
    }
  })

  return statuses
}