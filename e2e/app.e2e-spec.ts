import { PivotTablePage } from './app.po';

describe('pivot-table App', () => {
  let page: PivotTablePage;

  beforeEach(() => {
    page = new PivotTablePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
