# Contributing to RuneJS

RuneJS was created with the intention of utilizing JavaScript/TypeScript and Node's innovative features. RxJS was imported for reactive programming as well, opening up opportunities for easy content development. As such, there are a few things we're looking to avoid...

1. Direct ports/copying from Java servers
    - This defeats the purpose of RuneJS by implementing basic flows that any regular Java-based server would use. Think outside the box and really utilize ES6, TypeScript, Node, and RxJS! :)
2. Additional/outside dependencies
    - Sometimes additional dependencies cannot be avoided, but we'd like to avoid them as much as possible. RuneJS intends to be simple and easy for anyone to pick up, without requiring the user to set up any databases or additional third party systems.
    - In some cases this is of course unavoidable, as such we'll handle them on a case-by-case basis.

Ultimately if you're looking to contribute, it's best to check in with us on Discord to see if we're already working on a specific feature or have plans for it already. Add us at **Tyn#0001**

## Code Style

Code style (linting and formatting) are handled by [Biome](https://biomejs.dev/). It is recommended that you install [the Biome extension for your IDE](https://biomejs.dev/guides/editors/first-party-extensions/).

Running `npm run fin` will perform all necessary checks (linting, formatting, typechecking and tests).

## Testing

Unit tests can be written using Jest. To execute the test suite, run `npm test`

- Test files should be located next to the file under test, and called `file-name.test.ts`
- Tests should use the `when / then` pattern made up of composable `describe` statements
- Make use of `beforeEach` to set up state before each test

After running the tests, you can find code coverage in the `./coverage/` folder.

### When / Then testing pattern

Tests should be broken down into a series of `describe` statements, which set up their own internal state when possible.

```ts
describe('when there is a player', () => {
  let player: Player

  beforeEach(() => {
    player = createMockPlayer()
  })

  describe('when player is wearing a hat', () => {
    beforeEach(() => {
      player.equipment().set(0, someHatItem)
    })

    test('should return true', () => {
      const result = isWearingHat(player)

      expect(result).toEqual(true)
    })
  })
})
```

There are two main benefits to this kind of design:

- It serves as living documentation: from reading the `beforeEach` block you can clearly see how the prerequisite of "player is wearing a hat" is achieved
- It allows for easy expansion of test cases: future developers can add further
  statements inside "when player is wearing a hat" if they want to make use of
  that setup
