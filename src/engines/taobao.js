import {findNode} from 'utils/common';
import {setFileInputData, initUpload} from 'utils/engines';

const engine = 'taobao';

async function upload({task, search, image}) {
  const button = await findNode('div.drop-wrapper', {timeout: 120000});

  const input = await findNode('input#J_IMGSeachUploadBtn');
  input.addEventListener('click', ev => ev.preventDefault(), {
    capture: true,
    once: true
  });

  button.click();

  setFileInputData(input, image);

  input.dispatchEvent(new Event('change'));
}

function init() {
  initUpload(upload, engine, sessionKey);
}

init();
