import { ReactiveStorePage } from './app.po';

describe('reactive-store App', () => {
  let page: ReactiveStorePage;

  beforeEach(() => {
    page = new ReactiveStorePage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
