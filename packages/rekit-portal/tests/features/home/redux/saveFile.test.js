import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  HOME_SAVE_FILE_BEGIN,
  HOME_SAVE_FILE_SUCCESS,
  HOME_SAVE_FILE_FAILURE,
  HOME_SAVE_FILE_DISMISS_ERROR,
} from 'src/features/home/redux/constants';

import {
  saveFile,
  dismissSaveFileError,
  reducer,
} from 'src/features/home/redux/saveFile';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/saveFile', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when saveFile succeeds', () => {
    const store = mockStore({});

    return store.dispatch(saveFile())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', HOME_SAVE_FILE_BEGIN);
        expect(actions[1]).to.have.property('type', HOME_SAVE_FILE_SUCCESS);
      });
  });

  it('dispatches failure action when saveFile fails', () => {
    const store = mockStore({});

    return store.dispatch(saveFile({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).to.have.property('type', HOME_SAVE_FILE_BEGIN);
        expect(actions[1]).to.have.property('type', HOME_SAVE_FILE_FAILURE);
        expect(actions[1]).to.have.nested.property('data.error').that.exist;
      });
  });

  it('returns correct action by dismissSaveFileError', () => {
    const expectedAction = {
      type: HOME_SAVE_FILE_DISMISS_ERROR,
    };
    expect(dismissSaveFileError()).to.deep.equal(expectedAction);
  });

  it('handles action type HOME_SAVE_FILE_BEGIN correctly', () => {
    const prevState = { saveCodePending: false };
    const state = reducer(
      prevState,
      { type: HOME_SAVE_FILE_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveCodePending).to.be.true;
  });

  it('handles action type HOME_SAVE_FILE_SUCCESS correctly', () => {
    const prevState = { saveCodePending: true };
    const state = reducer(
      prevState,
      { type: HOME_SAVE_FILE_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveCodePending).to.be.false;
  });

  it('handles action type HOME_SAVE_FILE_FAILURE correctly', () => {
    const prevState = { saveCodePending: true };
    const state = reducer(
      prevState,
      { type: HOME_SAVE_FILE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveCodePending).to.be.false;
    expect(state.saveCodeError).to.exist;
  });

  it('handles action type HOME_SAVE_FILE_DISMISS_ERROR correctly', () => {
    const prevState = { saveCodeError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_SAVE_FILE_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveCodeError).to.be.null;
  });
});
