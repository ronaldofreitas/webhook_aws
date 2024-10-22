import { readFileSync, writeFileSync } from 'node:fs'
import { 
  getAccessToken, 
} from './sp_api.js'

function addSecondsToDate(date, seconds) {
  return new Date(date.getTime() + seconds * 1000)
}

function saveTokenToFile(account, region, tokenData) {
  var filename = ''
  if(account == 'ad'){
    if(region == 'na'){
      filename = 'na-token.json'
    }else if(region == 'eu'){
      filename = 'eu-token.json'
    }
  }else if(account == 'ro'){
    filename = 'ro-token.json'
  }else{
    throw new Error('saveTokenToFile not account or region')
  }
  writeFileSync(global.base_path+'/'+filename, JSON.stringify(tokenData, null, 2))
}

function readTokenFromFile(account, region) {
  try {
    var filename = ''
    if(account == 'ad'){
      if(region == 'na'){
        filename = 'na-token.json'
      }else if(region == 'eu'){
        filename = 'eu-token.json'
      }
    }else if(account == 'ro'){
      filename = 'ro-token.json'
    }else{
      throw new Error('saveTokenToFile not account or region')
    }
    const tokenData = readFileSync(global.base_path+'/'+filename, 'utf8')
    return JSON.parse(tokenData)
  } catch (err) {
    throw err
  }
}

function isTokenExpired(tokenData) {
  if (!tokenData || !tokenData.date_to_expire) {
    return true
  }
  const currentDate = new Date()
  const expireDate = new Date(tokenData.date_to_expire)
  return currentDate > expireDate
}

async function manageAccessToken(account, region) {
  try {
    let tokenData = readTokenFromFile(account, region)
    if (isTokenExpired(tokenData)) {
      const newToken = await getAccessToken(account, region)
      const expireDate = addSecondsToDate(new Date(), newToken.expires_in)
      tokenData = {
        access_token: newToken.access_token,
        date_to_expire: expireDate.toISOString()
      };
      saveTokenToFile(account, region, tokenData)
      return tokenData.access_token
    }else{
      return tokenData.access_token
    }
  } catch (error) {
    console.error(`[amazon][E-X1A][${account}][${region}][${error}]`)
    throw error
  }
}

export { manageAccessToken }