import { containsText } from "./fileSearch";
  

describe('testing SmokeTestSpike', () => {
  it('the text search should find the value SMOKE', async () => {
    const response = await containsText("Thing1")
    expect(response).toBeTruthy();
  });

  it('the text search should not find this SMOKE', async () => {
    const response = await containsText("Thing111")
    expect(response).toBeFalsy();
  });

  it('findind text with miss match capitals', async () => {
    const response = await containsText("Find")
    expect(response).toBeTruthy();
  });

});
