import Add from './Add.jsx';
import Remove from './Remove.jsx';
import Rename from './Rename.jsx';

const modals = {
  newChannel: Add,
  removeChannel: Remove,
  renameChannel: Rename,
};

export default (modalName) => modals[modalName];
