api 명세서 : https://tar-gazelle-0fd.notion.site/API-eb894553888f483d8f2c37ea5e568448<p>

도메인 주소 : freakj.shop:3000 입니다.

[데이터베이스.pdf](https://github.com/user-attachments/files/16966361/Untitled.pdf)
1. **암호화 방식**
    - 비밀번호를 DB에 저장할 때 Hash를 이용했는데, Hash는 단방향 암호화와 양방향 암호화 중 어떤 암호화 방식에 해당할까요?
    - -> 단방향 통신입니다. 
    - 비밀번호를 그냥 저장하지 않고 Hash 한 값을 저장 했을 때의 좋은 점은 무엇인가요?
    - -> Hash값을 조회해도 비밀번호를 알길이 없기때문에 악의적인 해킹을 방지할 수 있습니다.
2. **인증 방식**
    - JWT(Json Web Token)을 이용해 인증 기능을 했는데, 만약 Access Token이 노출되었을 경우 발생할 수 있는 문제점은 무엇일까요?
    - -> 누군가가 토큰을 복사해서 얻은 인가로 프라이빗한 정보들을 건드릴 수 있습니다.
    - 해당 문제점을 보완하기 위한 방법으로는 어떤 것이 있을까요?
    - -> 엑세스 토큰의 만료시간을 짧게하고 리프레시 토큰을 사용하는방법이 있습니다. 리프레시 토큰은 서버에서 저장해 만료시간을 길게 지정합니다.
3. **인증과 인가**
    - 인증과 인가가 무엇인지 각각 설명해 주세요.
    - -> 인증은 내가 누구다 ! 라고 자기자신을 알리는 방법이고, 인가는 누구인지 확인하고 그에 맞는 권한을 주는걸 인가라고 합니다
    - 위 API 구현 명세에서 인증을 필요로 하는 API와 그렇지 않은 API의 차이가 뭐라고 생각하시나요?
    - -> 프라이빗한 정보에 접근 할 수 있는지 없는지의 차이 인 것 같습니다.
    - 아이템 생성, 수정 API는 인증을 필요로 하지 않는다고 했지만 사실은 어느 API보다도 인증이 필요한 API입니다. 왜 그럴까요?
    - -> 누군가가 악의적으로 아이템을 복사, 성능 조작 을 할 수 있어 게임이 망가질 수 있습니다.
4. **Http Status Code**
    - 과제를 진행하면서 사용한 Http Status Code를 모두 나열하고, 각각이 의미하는 것과 어떤 상황에 사용했는지 작성해 주세요.
    - -> 404 : 정보가 없을때 사용합니다.
    - -> 400 : 정보가 올바르지 않을때 사용합니다.
    - -> 200 : 올바르게 처리가 됐을때 사용합니다.
5. **게임 경제**
    - 현재는 간편한 구현을 위해 캐릭터 테이블에 money라는 게임 머니 컬럼만 추가하였습니다.
        - 이렇게 되었을 때 어떠한 단점이 있을 수 있을까요?
        - -> 음... 수정할 수 있을 것 같습니다..?
        - 이렇게 하지 않고 다르게 구현할 수 있는 방법은 어떤 것이 있을까요?
        - -> 따로 테이블을 생성해서..? 높은권한을 가지게 합니다..? 
    - 아이템 구입 시에 가격을 클라이언트에서 입력하게 하면 어떠한 문제점이 있을 수 있을까요?
    - -> 공짜로 살 수 있습니다 !!! 너무 좋다. 하지만 게임 경제가 완전히 무너집니다..
