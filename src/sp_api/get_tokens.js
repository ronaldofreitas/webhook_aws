import 'dotenv/config'

const getAccessToken = async (account, region) => {
    let refresh_by_region = '', client_id = '', client_secret = ''
    if(account == 'ad'){
        client_id = process.env.CLIENT_ID_2
        client_secret = process.env.CLIENT_SECRET_2
        if(region == 'na'){
            refresh_by_region = process.env.REFRESH_TOKEN_2_NA
        }else if(region == 'eu'){
            refresh_by_region = process.env.REFRESH_TOKEN_2_EU
        }
    }else if(account == 'ro'){
        refresh_by_region = process.env.REFRESH_TOKEN_ROB
        client_id = process.env.CLIENT_ID_ROB
        client_secret = process.env.CLIENT_SECRET_ROB
    }else{
        throw new Error('Error getAccessToken not account or region')
    }
    if(client_id != '' && client_secret != ''){
        const body = {
            "grant_type": "refresh_token",
            "refresh_token": refresh_by_region,
            "client_id": client_id,
            "client_secret": client_secret,
        }
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }
        const url = 'https://api.amazon.com/auth/o2/token';
        return await fetch(url, requestOptions)
        .then(async response => {
            const data = await response.json()
            return data
        })
        .then(json => {
            return json
        }).catch((e) => {
            console.error(`[amazon][E-ACCTT1][${account}][${region}][${e}]`)
            throw e
        })
    }else{
        throw new Error('getAccessToken, No client_id or client_secret was provided')
    }
}


export {
    getAccessToken
}