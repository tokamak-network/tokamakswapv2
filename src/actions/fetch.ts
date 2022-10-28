import { fetchTokensURL} from '../constants/index';
import { TokensData } from '../types/tokens';

const getTokensData = async (): Promise<TokensData[] | undefined> => {    
    try {
      const tokensReq = await fetch(fetchTokensURL)
        .then((res) => res.json())
        .then((result) => result)
      const tokensData: TokensData[] = await tokensReq.datas;

      if (tokensData !== undefined) {
        return tokensData
      } else {
        return []
      }
    } catch (e) {
      console.log(e)
      return undefined
    }
  }


  export default getTokensData;