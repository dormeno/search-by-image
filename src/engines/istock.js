import {validateUrl} from 'utils/app';
import {findNode} from 'utils/common';
import {setFileInputData, initUpload} from 'utils/engines';

const engine = 'istock';

async function upload({task, search, image}) {
  if (window.screen.width < 1024) {
    let rsp = await fetch(
      'https://www.istockphoto.com/search/search-by-image/upload_data/' +
        new Date().getTime()
    );

    if (rsp.status !== 200) {
      throw new Error(`API response: ${rsp.status}, ${await rsp.text()}`);
    }

    const aws = await rsp.json();

    const data = new FormData();
    data.append('key', aws.key);
    data.append('AWSAccessKeyId', aws.AWSAccessKeyId);
    data.append('acl', aws.acl);
    data.append('policy', aws.policy);
    data.append('signature', aws.signature);
    data.append('Content-Type', image.imageType);
    data.append('success_action_redirect', aws.success_action_redirect);
    data.append('success_action_status', aws.success_action_status);
    data.append('file', image.imageBlob, image.imageFilename);

    rsp = await fetch(aws.url, {
      mode: 'cors',
      method: 'POST',
      body: data
    });

    if (rsp.status !== 201) {
      throw new Error(`API response: ${rsp.status}, ${await rsp.text()}`);
    }

    const tabUrl = 'https://www.istockphoto.com' + aws.presigned_url;

    if (validateUrl(tabUrl)) {
      window.location.replace(tabUrl);
    }
  } else {
    (await findNode('a.search-camera-icon')).click();

    const input = await findNode('input[type=file]');

    setFileInputData(input, image);

    input.dispatchEvent(new Event('change'));
  }
}

function init() {
  initUpload(upload, engine, sessionKey);
}

init();
