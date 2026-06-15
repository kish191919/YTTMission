-- ==========================================================
-- YTTM Wix → Supabase 데이터 마이그레이션
-- 생성: 2026-06-14
-- 포함: 게시글 9개, 갤러리 이미지 53개
-- ==========================================================

-- ----------------------------------------------------------
-- 1. 게시글 (posts) - 제2회 YTTM 비전영성캠프 그룹 (2025-12-29)
-- ----------------------------------------------------------
INSERT INTO public.posts (title, content, category, image_url, published, created_at) VALUES

('제2회 YTTM 비전영성캠프 사진 1',
 '<img src="https://static.wixstatic.com/media/95c05e_16ac2f3035cc41318a8f246b804f6287~mv2.jpg" alt="제2회 YTTM 비전영성캠프" style="max-width:100%;" />',
 '선교 소식',
 'https://static.wixstatic.com/media/95c05e_16ac2f3035cc41318a8f246b804f6287~mv2.jpg',
 true,
 '2025-12-29T00:00:00Z'),

('제2회 YTTM 비전영성캠프 사진 2',
 '<img src="https://static.wixstatic.com/media/95c05e_645ebd0d826c4061a8550ec5272cbbd4~mv2.jpg" alt="제2회 YTTM 비전영성캠프" style="max-width:100%;" />',
 '선교 소식',
 'https://static.wixstatic.com/media/95c05e_645ebd0d826c4061a8550ec5272cbbd4~mv2.jpg',
 true,
 '2025-12-29T00:01:00Z'),

('제2회 YTTM 비전영성캠프 사진 3',
 '<img src="https://static.wixstatic.com/media/95c05e_1878a868678f4c21a9f7a1d8a835e4b5~mv2.jpg" alt="제2회 YTTM 비전영성캠프" style="max-width:100%;" />',
 '선교 소식',
 'https://static.wixstatic.com/media/95c05e_1878a868678f4c21a9f7a1d8a835e4b5~mv2.jpg',
 true,
 '2025-12-29T00:02:00Z'),

('제2회 YTTM 비전영성캠프 사진 4',
 '<img src="https://static.wixstatic.com/media/95c05e_7595ed276c11431b95603f8df4c12bd1~mv2.jpg" alt="제2회 YTTM 비전영성캠프" style="max-width:100%;" />',
 '선교 소식',
 'https://static.wixstatic.com/media/95c05e_7595ed276c11431b95603f8df4c12bd1~mv2.jpg',
 true,
 '2025-12-29T00:03:00Z'),

('제2회 YTTM 비전영성캠프 사진 5',
 '<img src="https://static.wixstatic.com/media/95c05e_8a604537ec32473f99cf918dc250a42d~mv2.jpg" alt="제2회 YTTM 비전영성캠프" style="max-width:100%;" />',
 '선교 소식',
 'https://static.wixstatic.com/media/95c05e_8a604537ec32473f99cf918dc250a42d~mv2.jpg',
 true,
 '2025-12-29T00:04:00Z');


-- ----------------------------------------------------------
-- 2. 게시글 (posts) - YTTM 양영자 탁구선교회 게시글 그룹
-- ----------------------------------------------------------
INSERT INTO public.posts (title, content, category, image_url, published, created_at) VALUES

('양영자권사님 교회 간증자로 초청',
 '<p>천안동은교회 김훈 목사님께서 양영자 권사님(탁구선수)을 신앙 간증자로 초청하셨습니다.</p><p>25.10.26(주) 11시에 가능하신지 글을 올려봅니다.</p><p>교회 홈페이지: dongeunch.org</p><p>연락처: 010-9324-4718</p><img src="https://static.wixstatic.com/media/a55837_a4eca483b9b74d44924e1b84f8ca5ae4~mv2.png" alt="양영자권사님 교회 간증자로 초청" style="max-width:100%;" />',
 '간증',
 'https://static.wixstatic.com/media/a55837_a4eca483b9b74d44924e1b84f8ca5ae4~mv2.png',
 true,
 '2025-11-03T00:00:00Z'),

('YTTM 전국 크리스천 탁구대회',
 '<img src="https://static.wixstatic.com/media/a55837_c7947f3028214c64bc3f876113be21c3~mv2.png" alt="YTTM 전국 크리스천 탁구대회" style="max-width:100%;" />',
 '선교 소식',
 'https://static.wixstatic.com/media/a55837_c7947f3028214c64bc3f876113be21c3~mv2.png',
 true,
 '2025-11-03T00:01:00Z'),

('2025년 라오스 단기선교 사진',
 '<img src="https://static.wixstatic.com/media/a55837_941da07c97364243be24e70be5f36e67~mv2.jpg" alt="2025 라오스 단기선교" style="max-width:100%;" /><img src="https://static.wixstatic.com/media/a55837_fbb347ba95b84db2a05f9268a63364b6~mv2.jpg" alt="2025 라오스 단기선교" style="max-width:100%;" /><img src="https://static.wixstatic.com/media/a55837_615af45c5f7d4dee992b8630a288a337~mv2.jpg" alt="2025 라오스 단기선교" style="max-width:100%;" /><img src="https://static.wixstatic.com/media/a55837_00e3e399f5d84ee5b30ca63f76873400~mv2.jpg" alt="2025 라오스 단기선교" style="max-width:100%;" /><img src="https://static.wixstatic.com/media/a55837_fad676065b284614a0b0cb5f4c86ecb7~mv2.jpg" alt="2025 라오스 단기선교" style="max-width:100%;" /><img src="https://static.wixstatic.com/media/a55837_bcb79c25cee14281a2db40df59520bab~mv2.jpg" alt="2025 라오스 단기선교" style="max-width:100%;" /><img src="https://static.wixstatic.com/media/a55837_f8137f92d8fb4261bd44a0080ad8985a~mv2.jpg" alt="2025 라오스 단기선교" style="max-width:100%;" /><img src="https://static.wixstatic.com/media/a55837_e741716cda2549c091d6da4427318919~mv2.jpg" alt="2025 라오스 단기선교" style="max-width:100%;" />',
 '선교 소식',
 'https://static.wixstatic.com/media/a55837_941da07c97364243be24e70be5f36e67~mv2.jpg',
 true,
 '2025-11-03T00:02:00Z'),

('2024 파리 올림픽 사역 간증',
 '<img src="https://static.wixstatic.com/media/a55837_1bbc433ba05e432fb6cdd74b0f8749c5~mv2.jpg" alt="2024 파리 올림픽 사역 간증" style="max-width:100%;" />',
 '간증',
 'https://static.wixstatic.com/media/a55837_1bbc433ba05e432fb6cdd74b0f8749c5~mv2.jpg',
 true,
 '2025-11-03T00:03:00Z');


-- ----------------------------------------------------------
-- 3. 갤러리 (gallery) - 2025 선교 사진 > 크리스천 탁구대회 (15장)
-- ----------------------------------------------------------
INSERT INTO public.gallery (title, image_url, album, taken_at, created_at) VALUES
('크리스천 탁구대회', 'https://static.wixstatic.com/media/a55837_b9215d7bdf884cd89039f9b9715fddd5f003.jpg', '2025 크리스천 탁구대회', '2025-01-01', NOW()),
('크리스천 탁구대회', 'https://static.wixstatic.com/media/a55837_c91df4b4ab5e49a3a072e8b9337990a6~mv2.jpeg', '2025 크리스천 탁구대회', '2025-01-01', NOW()),
('크리스천 탁구대회', 'https://static.wixstatic.com/media/a55837_1139806254f54805be1b2675e2c29b60~mv2.jpeg', '2025 크리스천 탁구대회', '2025-01-01', NOW()),
('크리스천 탁구대회', 'https://static.wixstatic.com/media/a55837_8cdf4bc7dd9b40f6924ba997386cee27~mv2.jpeg', '2025 크리스천 탁구대회', '2025-01-01', NOW()),
('크리스천 탁구대회', 'https://static.wixstatic.com/media/a55837_c271e64bad8a44408571cce6a4ed6a41~mv2.jpeg', '2025 크리스천 탁구대회', '2025-01-01', NOW()),
('크리스천 탁구대회', 'https://static.wixstatic.com/media/a55837_294369fa0088411e9e5b25d81dc4e5df~mv2.jpeg', '2025 크리스천 탁구대회', '2025-01-01', NOW()),
('크리스천 탁구대회', 'https://static.wixstatic.com/media/a55837_5bf06f003d2f4e6d9a0080daa5b4e26c~mv2.jpeg', '2025 크리스천 탁구대회', '2025-01-01', NOW()),
('크리스천 탁구대회', 'https://static.wixstatic.com/media/a55837_c311ebf2593a46a593b70a627a604b50~mv2.jpeg', '2025 크리스천 탁구대회', '2025-01-01', NOW()),
('크리스천 탁구대회', 'https://static.wixstatic.com/media/a55837_cb2e5f6e7665437083cfb18bedad9b51~mv2.jpeg', '2025 크리스천 탁구대회', '2025-01-01', NOW()),
('크리스천 탁구대회', 'https://static.wixstatic.com/media/a55837_2084f709776d42d2b93eaa10fc75ebfb~mv2.jpeg', '2025 크리스천 탁구대회', '2025-01-01', NOW()),
('크리스천 탁구대회', 'https://static.wixstatic.com/media/a55837_bcccb4d2a9924e60a9f70dcc19171457~mv2.jpeg', '2025 크리스천 탁구대회', '2025-01-01', NOW()),
('크리스천 탁구대회', 'https://static.wixstatic.com/media/a55837_58a7545817634d2b956684dab5503fef~mv2.jpeg', '2025 크리스천 탁구대회', '2025-01-01', NOW()),
('크리스천 탁구대회', 'https://static.wixstatic.com/media/a55837_23c13fec57024627b4af8058fd5a27e1~mv2.jpeg', '2025 크리스천 탁구대회', '2025-01-01', NOW()),
('크리스천 탁구대회', 'https://static.wixstatic.com/media/a55837_1b1880cad795444584a99415f486699f~mv2.jpeg', '2025 크리스천 탁구대회', '2025-01-01', NOW()),
('크리스천 탁구대회', 'https://static.wixstatic.com/media/a55837_e3fdf322f57b47deb38d4ae4d9ca5a3b~mv2.jpeg', '2025 크리스천 탁구대회', '2025-01-01', NOW());


-- ----------------------------------------------------------
-- 3. 갤러리 (gallery) - 2025 선교 사진 > 인도네시아 친선탁구 (4장)
-- ----------------------------------------------------------
INSERT INTO public.gallery (title, image_url, album, taken_at, created_at) VALUES
('인도네시아 친선탁구', 'https://static.wixstatic.com/media/a55837_76f96ffa8fad41a1835be39bb175ea19~mv2.jpeg', '2025 인도네시아 친선탁구', '2025-01-01', NOW()),
('인도네시아 친선탁구', 'https://static.wixstatic.com/media/a55837_6c6ee5decf414ec690bab3c62ed14ce1~mv2.jpeg', '2025 인도네시아 친선탁구', '2025-01-01', NOW()),
('인도네시아 친선탁구', 'https://static.wixstatic.com/media/a55837_520628d1bc164894a0923e99abd8422d~mv2.jpeg', '2025 인도네시아 친선탁구', '2025-01-01', NOW()),
('인도네시아 친선탁구', 'https://static.wixstatic.com/media/a55837_bcd8663a1df844cc80d82c237ea2c9db~mv2.jpeg', '2025 인도네시아 친선탁구', '2025-01-01', NOW());


-- ----------------------------------------------------------
-- 4. 갤러리 (gallery) - 2025 선교 사진 > 동두천 희망나무 탁구학교 (5장)
-- ----------------------------------------------------------
INSERT INTO public.gallery (title, image_url, album, taken_at, created_at) VALUES
('동두천 희망나무 탁구학교', 'https://static.wixstatic.com/media/a55837_f7c2eaa9451f4793836e2cc82e0ee07e~mv2.jpeg', '2025 동두천 희망나무 탁구학교', '2025-01-01', NOW()),
('동두천 희망나무 탁구학교', 'https://static.wixstatic.com/media/a55837_50c51953edb8420f96c65192924f7953~mv2.jpeg', '2025 동두천 희망나무 탁구학교', '2025-01-01', NOW()),
('동두천 희망나무 탁구학교', 'https://static.wixstatic.com/media/a55837_2c4e10499cb343afac4a4edfe79d0e5a~mv2.jpeg', '2025 동두천 희망나무 탁구학교', '2025-01-01', NOW()),
('동두천 희망나무 탁구학교', 'https://static.wixstatic.com/media/a55837_4847965a6d2841af8ff2abefa098090a~mv2.jpeg', '2025 동두천 희망나무 탁구학교', '2025-01-01', NOW()),
('동두천 희망나무 탁구학교', 'https://static.wixstatic.com/media/a55837_c20f154eac2d4baab05852ad862a65c1~mv2.jpeg', '2025 동두천 희망나무 탁구학교', '2025-01-01', NOW());


-- ----------------------------------------------------------
-- 5. 갤러리 (gallery) - 2025 선교 사진 > 충북 음성 한국소비자원 (6장)
-- ----------------------------------------------------------
INSERT INTO public.gallery (title, image_url, album, taken_at, created_at) VALUES
('충북 음성 한국소비자원', 'https://static.wixstatic.com/media/a55837_dad9cc1c23d440ccaf4fcab837db3d44~mv2.png', '2025 충북 음성 한국소비자원', '2025-01-01', NOW()),
('충북 음성 한국소비자원', 'https://static.wixstatic.com/media/a55837_98a63b60f23f4218be38fa4d5e8d10c4~mv2.jpeg', '2025 충북 음성 한국소비자원', '2025-01-01', NOW()),
('충북 음성 한국소비자원', 'https://static.wixstatic.com/media/a55837_4902ec40097649eaa7ca3089834ae089~mv2.jpeg', '2025 충북 음성 한국소비자원', '2025-01-01', NOW()),
('충북 음성 한국소비자원', 'https://static.wixstatic.com/media/a55837_10214742683345e4aeae70c74822a8bb~mv2.jpeg', '2025 충북 음성 한국소비자원', '2025-01-01', NOW()),
('충북 음성 한국소비자원', 'https://static.wixstatic.com/media/a55837_c0e70750a1d045d48e68b8aae234d826~mv2.jpeg', '2025 충북 음성 한국소비자원', '2025-01-01', NOW()),
('충북 음성 한국소비자원', 'https://static.wixstatic.com/media/a55837_54a0a30ca974493bb729dbd79a1d4654~mv2.jpeg', '2025 충북 음성 한국소비자원', '2025-01-01', NOW());


-- ----------------------------------------------------------
-- 6. 갤러리 (gallery) - 2024 몽골 선교 (9장)
-- ----------------------------------------------------------
INSERT INTO public.gallery (title, image_url, album, taken_at, created_at) VALUES
('2024 몽골 선교', 'https://static.wixstatic.com/media/a55837_6539cbbfd1604808854194717ee7e29df003.jpg', '2024 몽골 선교', '2024-01-01', NOW()),
('2024 몽골 선교', 'https://static.wixstatic.com/media/a55837_fc97ad0515fd4a0aa11623b1dd2f52ebf003.jpg', '2024 몽골 선교', '2024-01-01', NOW()),
('2024 몽골 선교', 'https://static.wixstatic.com/media/a55837_3fa45118f82140fd845c4b0b02c32dbdf003.jpg', '2024 몽골 선교', '2024-01-01', NOW()),
('2024 몽골 선교', 'https://static.wixstatic.com/media/a55837_2154d1726c9b489393c06f05269d4529~mv2.jpeg', '2024 몽골 선교', '2024-01-01', NOW()),
('2024 몽골 선교', 'https://static.wixstatic.com/media/a55837_f4d6e7cb55c44272be1f11059fbf214f~mv2.jpeg', '2024 몽골 선교', '2024-01-01', NOW()),
('2024 몽골 선교', 'https://static.wixstatic.com/media/a55837_bd4ddf2b9d9f4508843d70eeef34ecaf~mv2.jpeg', '2024 몽골 선교', '2024-01-01', NOW()),
('2024 몽골 선교', 'https://static.wixstatic.com/media/a55837_93fdab4e627e4913b61b3a584a776730~mv2.jpeg', '2024 몽골 선교', '2024-01-01', NOW()),
('2024 몽골 선교', 'https://static.wixstatic.com/media/a55837_cce774a579a6450e8dc9d81d0301de1e~mv2.jpeg', '2024 몽골 선교', '2024-01-01', NOW()),
('2024 몽골 선교', 'https://static.wixstatic.com/media/a55837_23ba0f2162da4243a7b5cf0c289d65fe~mv2.jpeg', '2024 몽골 선교', '2024-01-01', NOW());


-- ----------------------------------------------------------
-- 7. 갤러리 (gallery) - 2024 선교 사진 (14장)
-- ----------------------------------------------------------
INSERT INTO public.gallery (title, image_url, album, taken_at, created_at) VALUES
('2024 선교 사진', 'https://static.wixstatic.com/media/a55837_46f58ae0248b437e9de2afc72bc82198f003.jpg', '2024 선교 사진', '2024-01-01', NOW()),
('2024 선교 사진', 'https://static.wixstatic.com/media/a55837_56c84a2b30b54df0a872bc1dc423d698f003.jpg', '2024 선교 사진', '2024-01-01', NOW()),
('2024 선교 사진', 'https://static.wixstatic.com/media/a55837_5c8667546c80451485d2772de650d84bf003.jpg', '2024 선교 사진', '2024-01-01', NOW()),
('2024 선교 사진', 'https://static.wixstatic.com/media/a55837_370977b78aaf46a6b23449c673d8af84f003.jpg', '2024 선교 사진', '2024-01-01', NOW()),
('2024 선교 사진', 'https://static.wixstatic.com/media/a55837_2b505a4b422f45e5bd64ca9b00b2e72c~mv2.jpeg', '2024 선교 사진', '2024-01-01', NOW()),
('2024 선교 사진', 'https://static.wixstatic.com/media/a55837_5659ec98d650450eb04f28064f99cc22~mv2.jpeg', '2024 선교 사진', '2024-01-01', NOW()),
('2024 선교 사진', 'https://static.wixstatic.com/media/a55837_3d4e199f36b54491ad2af09f164b20cb~mv2.jpeg', '2024 선교 사진', '2024-01-01', NOW()),
('2024 선교 사진', 'https://static.wixstatic.com/media/a55837_b3daa92c653b44919229449fdaba7c88~mv2.jpeg', '2024 선교 사진', '2024-01-01', NOW()),
('2024 선교 사진', 'https://static.wixstatic.com/media/a55837_51c31ab03f9a43b399b81ae68a7ea0e3~mv2.jpeg', '2024 선교 사진', '2024-01-01', NOW()),
('2024 선교 사진', 'https://static.wixstatic.com/media/a55837_407ca4f3525a4f129e27fafd96b66c05~mv2.jpeg', '2024 선교 사진', '2024-01-01', NOW()),
('2024 선교 사진', 'https://static.wixstatic.com/media/a55837_93a509a73985495484f4fca7ec00aa16~mv2.jpeg', '2024 선교 사진', '2024-01-01', NOW()),
('2024 선교 사진', 'https://static.wixstatic.com/media/a55837_0861131230b94885a305c979a4c31fd2~mv2.jpeg', '2024 선교 사진', '2024-01-01', NOW()),
('2024 선교 사진', 'https://static.wixstatic.com/media/a55837_5be8920384db40879f86b943e0848356~mv2.jpeg', '2024 선교 사진', '2024-01-01', NOW()),
('2024 선교 사진', 'https://static.wixstatic.com/media/a55837_eb97bf9cf71d4716887988e4b7300e67~mv2.jpeg', '2024 선교 사진', '2024-01-01', NOW());
