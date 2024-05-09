export const VERSION = '1.3.0'

export const StagingServer = {
  name: 'Staging',
  uploadServer: 'http://do.ecven.com:8024/uploadMemoSessionMedia',
  websocketServer: 'ws://do.ecven.com:8020/explr_staging',
  debug: true,
}
export const LiveServer = {
  name: 'Live',
  uploadServer: 'http://do.ecven.com:8022/upload',
  websocketServer: 'ws://do.ecven.com:8020/explr',
  debug: true,
}

export const MarkServer_HTTPS = {
  memoSessionUploadServer: 'http://174.74.148.98:3011/uploadMemoSessionMedia',
  locationGalleryUploadServer: 'http://174.74.148.98:3011/uploadLocationGalleryMedia',
  uploadNewUnconfirmedLocationMedia: 'http://174.74.148.98:3011/uploadNewUnconfirmedLocationMedia',
  uploadProfileCoverPhoto: 'http://174.74.148.98:3011/uploadProfileCoverPhoto',
  websocketServer: 'ws://174.74.148.98:8011',
  debug: true,
}
export const StagingServer_HTTPS = {
  name: 'Staging',
  memoSessionUploadServer: 'https://do.ecven.com:8124/uploadMemoSessionMedia',
  locationGalleryUploadServer: 'https://do.ecven.com:8124/uploadLocationGalleryMedia',
  uploadNewUnconfirmedLocationMedia: 'https://do.ecven.com:8124/uploadNewUnconfirmedLocationMedia',
  uploadProfileCoverPhoto: 'https://do.ecven.com:8124/uploadProfileCoverPhoto',
  websocketServer: 'wss://do.ecven.com:8120/explr_staging',
  debug: true,
}

export const LiveServer_HTTPS = {
  name: 'Live',
  memoSessionUploadServer: 'https://do.ecven.com:8122/uploadMemoSessionMedia',
  locationGalleryUploadServer: 'https://do.ecven.com:8122/uploadLocationGalleryMedia',
  uploadNewUnconfirmedLocationMedia: 'https://do.ecven.com:8122/uploadNewUnconfirmedLocationMedia',
  uploadProfileCoverPhoto: 'https://do.ecven.com:8122/uploadProfileCoverPhoto',
  websocketServer: 'wss://do.ecven.com:8120/explr',
  debug: true,
}

export const LocalServer = {
  name: 'Local',
  memoSessionUploadServer: 'http://192.168.0.169:3011/uploadMemoSessionMedia',
  locationGalleryUploadServer: 'http://192.168.0.169:3011/uploadLocationGalleryMedia',
  uploadNewUnconfirmedLocationMedia: 'http://192.168.0.169:3011/uploadNewUnconfirmedLocationMedia',
  uploadProfileCoverPhoto: 'http://192.168.0.169:3011/uploadProfileCoverPhoto',
  websocketServer: 'ws://192.168.0.169:8011', //"ws://192.168.0.47:8011",
  debug: true,
}
