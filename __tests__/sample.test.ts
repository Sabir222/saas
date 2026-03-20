describe("Math", () => {
  it("adds numbers correctly", () => {
    expect(1 + 1).toBe(2)
  })

  it("subtracts numbers correctly", () => {
    expect(5 - 3).toBe(2)
  })

  describe("multiplication", () => {
    it("multiplies numbers correctly", () => {
      expect(3 * 4).toBe(12)
    })
  })
})
