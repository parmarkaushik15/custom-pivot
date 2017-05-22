import { RemoveNaNPipe } from './remove-na-n.pipe';

describe('RemoveNaNPipe', () => {
  it('create an instance', () => {
    const pipe = new RemoveNaNPipe();
    expect(pipe).toBeTruthy();
  });
});
