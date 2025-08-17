import os
import sys

# 프로젝트 루트 디렉토리를 Python 경로에 추가
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

from sqlmodel import Session
from app.database import engine, create_db_and_tables, test_db_connection
from app.models import Publication


def parse_authors_contribution(authors_str):
    """저자 문자열에서 기여도 정보를 파싱"""
    is_first_author = False
    is_corresponding = False
    is_equal_contribution = False

    # Joohoon Kim이 first author인지 확인 (첫 번째 저자이거나 *표시)
    if authors_str.startswith("Joohoon Kim"):
        is_first_author = True
    elif "Joohoon Kim*" in authors_str:
        is_equal_contribution = True

    # Corresponding author 확인 (+표시)
    if "Junsuk Rho+" in authors_str:
        is_corresponding = True

    # Contribution type 결정
    if is_first_author:
        contribution_type = "first-author"
    elif is_corresponding:
        contribution_type = "corresponding"
    elif is_equal_contribution:
        contribution_type = "equal-contribution"
    else:
        contribution_type = "co-author"

    return is_first_author, is_corresponding, is_equal_contribution, contribution_type


def get_db_session():
    """데이터베이스 세션을 생성합니다."""
    return Session(engine)


def insert_publications_data():
    publications_data = [
        # Under submission
        {
            "number": 64,
            "title": "Wide-field-of-view, switchable, multi-dimensional light-field display using a metasurface lenticular lens",
            "authors": "Seokil Moon*, Joohoon Kim*, Youngjin Jo*, Juwon Seo, Kyungtae Kim, Chang-Kun Lee+, Junsuk Rho+",
            "journal": "Nature", "year": "2025", "status": "under-submission",
            "featured_info": "in revision"
        },
        {
            "number": 63,
            "title": "Nanoprinting metasurfaces with engineered optical materials",
            "authors": "Dong Kyo Oh*, Hyunjung Kang*, Dohyun Kang*, Joohoon Kim*, Junsuk Rho+",
            "journal": "Nature Review Materials", "year": "2025",
            "status": "under-submission", "featured_info": "in revision"
        },
        {
            "number": 62,
            "title": "Polariton condensate far-detuned from exciton resonance in WS2 bound states in the continuum",
            "authors": "Junghyun Sung*, Joohoon Kim*, Ho Seung Lee, Woo Hun Choi, Minsu Jeong, Jihae Lee, Seokwoo Kim, Dong-Jin Shin, Daegwang Choi, Junsuk Rho+, Su-Hyun Gong+, Hyun Gyu Song+",
            "journal": "Nature Communications", "year": "2025",
            "status": "under-submission", "featured_info": "in revision"
        },
        {
            "number": 61,
            "title": "Roll-to-roll manufacturing of 1 cm visible metalenses with industrial-level throughput of 300 unit per second",
            "authors": "Trung Hoang*, Yujin Park*, Joohoon Kim*, Han Truong, Kyungtae Kim, Dohyun Kang, Gyoseon Jeon, Kyung-il Lee, Dong Hyun Yoon, Sajjan Parajuli, Inki Kim+, Junsuk Rho+, Gyoujin Cho+",
            "journal": "Nature", "year": "2025", "status": "under-submission",
            "featured_info": "in revision"
        },
        {
            "number": 60,
            "title": "Sustainable manufacturing of optical metasurfaces with atomic layer coated high-index resin composite",
            "authors": "Minseok Choi*, Hyujung Kang*, Dohyun Kang*, Joohoon Kim, Junsuk Rho+",
            "journal": "PhotoniX", "year": "2025", "status": "under-submission",
            "featured_info": "in review"
        },

        # 2025 Published
        {
            "number": 61,
            "title": "Compact eye camera with two-third wavelength phase-delay metalens",
            "authors": "Jeong-Geun Yun*, Hyunjung Kang*, Kyookeun Lee, Youngmo Jeong, Eunji Lee, Joohoon Kim, Minseok Choi, Bonkon Koo, Doyoun Kim, Jongchul Choi, Junsuk Rho+",
            "journal": "Nature Communications", "year": "2025",
            "status": "in-press"
        },
        {
            "number": 60,
            "title": "Metasurface absorber-emitter pair-integrated high-efficiency thermophotovoltaic system",
            "authors": "Sumbel Ijaz*, Dohyun Kang*, Ahsan Sarwar Rana*, Joohoon Kim, Muhammad Tariq Saeed Chani, Muhammad Zubair+, Qammer H. Abbassi+, Muhammad Qasim Mehmood+, Junsuk Rho+",
            "journal": "ACS Photonics", "year": "2025", "status": "in-press"
        },
        {
            "number": 59,
            "title": "Ultraviolet-visible spin-resolved chip-scale spectroscopy",
            "authors": "Nasir Mahmood*, Yujin Park*, Naureen Butt*, Joohoon Kim, Dongliong Gao, Muhammad Zubair, Tauseef Tauqeer+, Lei Gao+, Muhammad Qasim Mehmood+, Junsuk Rho+",
            "journal": "Advanced Functional Materials", "year": "2025",
            "status": "in-press"
        },
        {
            "number": 58,
            "title": "Single-layer waveguide display using achromatic metagratings for full-colour augmented reality",
            "authors": "Seokil Moon*, Seokwoo Kim*, Joohoon Kim*, Chang-Kun Lee, Junsuk Rho+",
            "journal": "Nature Nanotechnology", "volume": "20",
            "pages": "747-754", "year": "2025"
        },
        {
            "number": 57,
            "title": "Achromatic metagratings for compact near-eye displays",
            "authors": "Seokwoo Kim*, Joohoon Kim*, Junsuk Rho+",
            "journal": "Nature Nanotechnology", "volume": "20",
            "pages": "721-722", "year": "2025"
        },
        {
            "number": 56, "title": "Nanofabrication for nanophotonics",
            "authors": "Younghwan Yang, Youngsun Jeon, Zhaogang Dong, Joel K. W. Yang, Mahsa Haddadi, Moghaddam, Dai Sik Kim, Dong Kyo Oh, Jihae Lee, Mario Hentschel, Harald Giessen, Dohyun Kang, Gyeongtae Kim, Takuo Tanaka, Yang Zhao, Johannes Bürger, Stefan A. Maier, Haoran Ren, Wooik Jung, Mansoo Choi, Gwangmin Bae, Haomin Chen, Seokwoo Jeon, Jaekyung Kim, Eunji Lee, Hyunjung Kang, Yujin Park, Dang Du Nguyen, Inki kim, Pablo Cencilo-Abad, Debashis Chanda, Xinxin Jing, Na Liu, Irina V. Martynenko, Tim Liedl, Yuna Kwak, Jwa-Min Nam, Sang-Min Park, Teri W. Odom, Hye-Eun Lee, Ryeong Myeong Kim, Ki Tae Nam, Hyunah Kwon, Hyeon-Ho Jeong, Peer Fishcer, Jiwon Yoon, Shin-Hyun Kim, Sangmin Shim, Dasol Lee, Luis A. Pérez, Xiaoyu Qi, Agustin Mihi, Hohyun Keum, Moonsub Shim, Seok Kim, Hanhwi Jang, Yeon Sik Jung, Christian Rossner, Tobias A. F. König, Andreas Fery, Zhiwei Li, Koray Aydin, Chad A. Mirkin, Junhwa seong, Nara Jeon, Zhiyun Xu, Tian Gu, Juejun Hu, Hyunghan Kwon, Hojoong Jung, Hossein Alijan, Igor Aharonovich, Joohoon Kim, Junsuk Rho+",
            "journal": "ACS Nano", "volume": "19", "pages": "12491-12605",
            "year": "2025", "featured_info": "Review Paper"
        },
        {
            "number": 55,
            "title": "Roll-to-plate printable RGB achromatic metalens for wide-field-of-view holographic near-eye displays",
            "authors": "Minseok Choi*, Joohoon Kim*, Seokil Moon*, Kilsoo Shin*, Seung-Woo Nam, Yujin Park, Dohyun Kang, Gyoseon Jeon, Kyung-il Lee, Dong Hyun Yoon, Yoonchan Jeong, Chang-Kun Lee, Junsuk Rho+",
            "journal": "Nature Materials", "volume": "24", "pages": "535-543",
            "year": "2025",
            "featured_info": "Featured as Cover Article of 2025 April issue"
        },

        # 계속해서 모든 데이터를 추가...
        # 2024 papers
        {
            "number": 47,
            "title": "Amorphous to crystalline transition in nanoimprinted sol-gel titanium oxide metasurfaces",
            "authors": "Joohoon Kim*, Wonjoong Kim*, Minseok Choi*, Yujin Park, Dohyun Kang, Eunji Lee, Chanwoong Park, Hansang Sung, Heon Lee+, Junsuk Rho+",
            "journal": "Advanced Materials", "volume": "36", "pages": "2405378",
            "year": "2024"
        },

        # 2023 papers - 여기서는 주요 몇 개만 예시
        {
            "number": 28,
            "title": "Scalable manufacturing of high-index atomic layer-polymer hybrid metasurfaces for metaphotonics in the visible",
            "authors": "Joohoon Kim*, Junhwa Seong*, Wonjoong Kim*, Gun-Yeal Lee, Seokwoo Kim, Hongyoon Kim, Seong-Won Moon, Dong Kyo Oh, Younghwan Yang, Jeonghoon Park, Jaehyuck Jang, Yeseul Kim, Minsu Jeong, Chanwoong Park, Hojung Choi, Gyoseon Jeon, Kyung-Il Lee, Dong Hyun Yoon, Namkyoo Park, Byoungho Lee, Heon Lee+, Junsuk Rho+",
            "journal": "Nature Materials", "volume": "22", "pages": "474-481",
            "year": "2023",
            "arxiv": "2208.12665"
        },
        {
            "number": 29,
            "title": "Multicolor and 3D holography generated by inverse-design single-cell metasurfaces",
            "authors": "Sunae So*, Joohoon Kim*, Trevon Badloe*, Chihun Lee, Younghwan Yang, Hyunjung Kang, Junsuk Rho+",
            "journal": "Advanced Materials", "volume": "35", "pages": "2208520",
            "year": "2023",
            "arxiv": "2207.04778"
        },

        # 이하 2022, 2021, 2020 데이터들도 동일한 방식으로 추가
    ]

    db = get_db_session()
    try:
        print("📝 Publication 데이터 삽입 중...")
        for pub_data in publications_data:
            # 기여도 정보 파싱
            is_first, is_corresponding, is_equal, contribution = parse_authors_contribution(
                pub_data["authors"])

            publication = Publication(
                number=pub_data["number"],
                title=pub_data["title"],
                authors=pub_data["authors"],
                journal=pub_data["journal"],
                volume=pub_data.get("volume"),
                pages=pub_data.get("pages"),
                year=pub_data["year"],
                month=pub_data.get("month"),
                doi=pub_data.get("doi"),
                arxiv=pub_data.get("arxiv"),
                is_first_author=is_first,
                is_corresponding_author=is_corresponding,
                is_equal_contribution=is_equal,
                contribution_type=contribution,
                status=pub_data.get("status", "published"),
                featured_info=pub_data.get("featured_info")
            )
            db.add(publication)

        db.commit()
        print("✅ Publications data inserted successfully!")
    except Exception as e:
        print(f"❌ 데이터 삽입 중 오류 발생: {e}")
        db.rollback()
    finally:
        db.close()


def main():
    """메인 함수"""
    print("🔧 데이터베이스 연결 확인 중...")

    if not test_db_connection():
        print("❌ 데이터베이스 연결에 실패했습니다.")
        return

    print("📊 테이블 생성 중...")
    create_db_and_tables()

    insert_publications_data()
    print("🎉 모든 Publication 데이터가 성공적으로 삽입되었습니다!")


if __name__ == "__main__":
    main()
