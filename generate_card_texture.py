import os
import qrcode
from PIL import Image, ImageDraw, ImageFont

def create_card_texture():
    width, height = 1024, 1024
    base = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    
    font_bold = "C:/Windows/Fonts/segoeuib.ttf"
    font_reg = "C:/Windows/Fonts/segoeui.ttf"
    font_arial_b = "C:/Windows/Fonts/arialbd.ttf"
    
    def get_font(path, size):
        try:
            return ImageFont.truetype(path, size)
        except:
            return ImageFont.load_default()

    f_title = get_font(font_arial_b, 46)
    f_sub = get_font(font_bold, 24)
    f_body = get_font(font_bold, 18)
    f_sm = get_font(font_bold, 13)
    f_xs = get_font(font_bold, 11)
    f_badge = get_font(font_bold, 13)
    f_large = get_font(font_bold, 30)

    # ─────────────────────────────────────────────────────────────────────────
    # 1. FRONT CARD (x: 25 to 486, y: 19 to 756)
    # ─────────────────────────────────────────────────────────────────────────
    fx1, fy1, fx2, fy2 = 25, 19, 486, 756
    card_w = fx2 - fx1
    card_h = fy2 - fy1

    front_im = Image.new("RGBA", (card_w, card_h), (0, 0, 0, 0))
    fdraw = ImageDraw.Draw(front_im)

    # Deep dark tech blue gradient
    for y in range(card_h):
        ratio = y / card_h
        r = int(8 + ratio * 6)
        g = int(16 + ratio * 10)
        b = int(32 + ratio * 16)
        fdraw.line([(0, y), (card_w, y)], fill=(r, g, b, 255))

    # Dot grid
    for x in range(20, card_w, 24):
        for y in range(20, card_h, 24):
            fdraw.point((x, y), fill=(14, 165, 233, 50))

    # Outer border
    fdraw.rounded_rectangle([(8, 8), (card_w - 8, card_h - 8)], radius=18, outline=(14, 165, 233, 180), width=2)

    # Corner brackets (Tech HUD style)
    c_len = 24
    c_color = (56, 189, 248, 240)
    # TL
    fdraw.line([(12, 12), (12 + c_len, 12)], fill=c_color, width=2)
    fdraw.line([(12, 12), (12, 12 + c_len)], fill=c_color, width=2)
    # TR
    fdraw.line([(card_w - 12 - c_len, 12), (card_w - 12, 12)], fill=c_color, width=2)
    fdraw.line([(card_w - 12, 12), (card_w - 12, 12 + c_len)], fill=c_color, width=2)
    # BL
    fdraw.line([(12, card_h - 12), (12 + c_len, card_h - 12)], fill=c_color, width=2)
    fdraw.line([(12, card_h - 12 - c_len), (12, card_h - 12)], fill=c_color, width=2)
    # BR
    fdraw.line([(card_w - 12 - c_len, card_h - 12), (card_w - 12, card_h - 12)], fill=c_color, width=2)
    fdraw.line([(card_w - 12, card_h - 12 - c_len), (card_w - 12, card_h - 12)], fill=c_color, width=2)

    # Top slot cutout line indicator
    fdraw.rounded_rectangle([(card_w // 2 - 32, 16), (card_w // 2 + 32, 24)], radius=4, fill=(15, 23, 42, 255), outline=(14, 165, 233, 140), width=1)

    # Badge: JUNIOR
    fdraw.rounded_rectangle([(24, 34), (105, 58)], radius=6, fill=(14, 165, 233, 40), outline=(56, 189, 248, 220), width=1)
    fdraw.text((36, 38), "JUNIOR", font=f_badge, fill=(56, 189, 248, 255))

    # University right aligned
    fdraw.text((card_w - 24, 32), "UNPAS BANDUNG", font=f_xs, fill=(241, 245, 249, 255), anchor="ra")
    fdraw.text((card_w - 24, 46), "SMKN 1 CIKARANG BRT", font=f_xs, fill=(148, 163, 184, 220), anchor="ra")

    # Large DEVELOPER Title
    fdraw.text((24, 68), "DEV", font=f_title, fill=(255, 255, 255, 255))
    fdraw.text((120, 68), "ELOPER", font=f_title, fill=(56, 189, 248, 255))

    # GSA 2026 Badge
    fdraw.rounded_rectangle([(card_w - 110, 74), (card_w - 24, 98)], radius=12, fill=(16, 185, 129, 35), outline=(16, 185, 129, 220), width=1)
    fdraw.text((card_w - 67, 80), "* GSA 2026", font=f_xs, fill=(16, 185, 129, 255), anchor="ma")

    # Photo section
    photo_box = (24, 126, 304, 406)
    photo_w = photo_box[2] - photo_box[0]
    photo_h = photo_box[3] - photo_box[1]

    photo_path = "d:/Portofolio/public/Photo.jpg"
    if os.path.exists(photo_path):
        try:
            user_photo = Image.open(photo_path).convert("RGBA")
            pw, ph = user_photo.size
            min_dim = min(pw, ph)
            crop_x = (pw - min_dim) // 2
            crop_y = (ph - min_dim) // 2
            user_photo = user_photo.crop((crop_x, crop_y, crop_x + min_dim, crop_y + min_dim))
            user_photo = user_photo.resize((photo_w, photo_h), Image.Resampling.LANCZOS)
            
            mask = Image.new("L", (photo_w, photo_h), 0)
            ImageDraw.Draw(mask).rounded_rectangle([(0, 0), (photo_w, photo_h)], radius=12, fill=255)
            front_im.paste(user_photo, (photo_box[0], photo_box[1]), mask)
        except Exception as e:
            print("Photo load error:", e)

    fdraw.rounded_rectangle([photo_box[0], photo_box[1], photo_box[2], photo_box[3]], radius=12, outline=(56, 189, 248, 160), width=2)

    # VERIFIED ID Bar
    fdraw.rounded_rectangle([(photo_box[0] + 6, photo_box[3] - 28), (photo_box[0] + 130, photo_box[3] - 6)], radius=6, fill=(10, 18, 32, 240), outline=(16, 185, 129, 220), width=1)
    fdraw.ellipse([(photo_box[0] + 16, photo_box[3] - 20), (photo_box[0] + 24, photo_box[3] - 12)], fill=(16, 185, 129, 255))
    fdraw.text((photo_box[0] + 30, photo_box[3] - 22), "VERIFIED ID", font=f_xs, fill=(16, 185, 129, 255))

    # Right Sidebar next to photo: "TEKNIK INFORMATIKA" (vertical text)
    sidebar_x = photo_box[2] + 12
    sidebar_w = card_w - 24 - sidebar_x
    fdraw.rounded_rectangle([(sidebar_x, photo_box[1]), (card_w - 24, photo_box[3])], radius=10, fill=(10, 22, 40, 200), outline=(14, 165, 233, 90), width=1)
    
    v_text = "TEKNIK INFORMATIKA"
    vert_im = Image.new("RGBA", (photo_h, sidebar_w), (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(vert_im)
    vdraw.text((photo_h // 2, sidebar_w // 2), v_text, font=get_font(font_arial_b, 17), fill=(56, 189, 248, 255), anchor="mm")
    vert_rotated = vert_im.rotate(90, expand=True)
    front_im.paste(vert_rotated, (sidebar_x + (sidebar_w - vert_rotated.width) // 2, photo_box[1] + (photo_h - vert_rotated.height) // 2), vert_rotated)

    # Name plate section (dark contrast navy background)
    name_y = 420
    fdraw.rounded_rectangle([(24, name_y), (card_w - 24, name_y + 66)], radius=12, fill=(10, 22, 42, 240), outline=(56, 189, 248, 120), width=1)
    fdraw.text((38, name_y + 10), "BILLY WICAKSONO", font=f_sub, fill=(255, 255, 255, 255))
    # Verified badge circle
    fdraw.ellipse([(268, name_y + 16), (286, name_y + 34)], fill=(14, 165, 233, 255))
    fdraw.line([(273, name_y + 25), (276, name_y + 29)], fill=(255, 255, 255, 255), width=2)
    fdraw.line([(276, name_y + 29), (282, name_y + 21)], fill=(255, 255, 255, 255), width=2)
    fdraw.text((38, name_y + 38), "S1 Informatics • IPK 3.76 (KIP-K)", font=f_sm, fill=(148, 163, 184, 255))

    # Stat Badges (IPK, SEMESTER, BNSP)
    badge_y = 498
    col_w = (card_w - 48 - 16) // 3
    badges_info = [("IPK", "3.76"), ("SEMESTER", "4"), ("SERTIFIKASI", "BNSP IT")]
    for i, (blabel, bval) in enumerate(badges_info):
        bx = 24 + i * (col_w + 8)
        fdraw.rounded_rectangle([(bx, badge_y), (bx + col_w, badge_y + 50)], radius=8, fill=(10, 20, 38, 230), outline=(14, 165, 233, 90), width=1)
        fdraw.text((bx + col_w // 2, badge_y + 15), bval, font=f_body, fill=(56, 189, 248, 255), anchor="mm")
        fdraw.text((bx + col_w // 2, badge_y + 35), blabel, font=f_xs, fill=(148, 163, 184, 220), anchor="mm")

    # Bottom PORTFOLIO strip
    strip_y = 560
    fdraw.rounded_rectangle([(24, strip_y), (card_w - 24, strip_y + 40)], radius=8, fill=(14, 165, 233, 35), outline=(56, 189, 248, 140), width=1)
    fdraw.text((card_w // 2, strip_y + 20), "PORTFOLIO • UNIVERSITAS PASUNDAN", font=f_badge, fill=(255, 255, 255, 255), anchor="mm")

    # Quote footer
    fdraw.text((card_w // 2, 620), "Don't repeat yourself — Code Clean, Think Bigger", font=f_xs, fill=(148, 163, 184, 220), anchor="mm")
    fdraw.text((card_w // 2, 640), "billywicaksono.com", font=f_xs, fill=(56, 189, 248, 200), anchor="mm")

    base.paste(front_im, (fx1, fy1))

    # ─────────────────────────────────────────────────────────────────────────
    # 2. BACK CARD (x: 537 to 998, y: 19 to 756)
    # ─────────────────────────────────────────────────────────────────────────
    bx1, by1, bx2, by2 = 537, 19, 998, 756
    b_card_w = bx2 - bx1
    b_card_h = by2 - by1

    back_im = Image.new("RGBA", (b_card_w, b_card_h), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(back_im)

    # Deep luxury dark navy
    for y in range(b_card_h):
        ratio = y / b_card_h
        r = int(6 + ratio * 6)
        g = int(12 + ratio * 10)
        b = int(24 + ratio * 18)
        bdraw.line([(0, y), (b_card_w, y)], fill=(r, g, b, 255))

    # Circuit lines
    b_color_dim = (14, 165, 233, 30)
    for i in range(16):
        y_pos = i * 46
        bdraw.line([(0, y_pos), (b_card_w, y_pos - 80)], fill=b_color_dim, width=1)
        bdraw.line([(0, y_pos), (b_card_w, y_pos + 80)], fill=b_color_dim, width=1)

    # Outer border
    bdraw.rounded_rectangle([(8, 8), (b_card_w - 8, b_card_h - 8)], radius=18, outline=(14, 165, 233, 180), width=2)
    
    # Corner brackets (Back)
    bdraw.line([(12, 12), (12 + c_len, 12)], fill=c_color, width=2)
    bdraw.line([(12, 12), (12, 12 + c_len)], fill=c_color, width=2)
    bdraw.line([(b_card_w - 12 - c_len, 12), (b_card_w - 12, 12)], fill=c_color, width=2)
    bdraw.line([(b_card_w - 12, 12), (b_card_w - 12, 12 + c_len)], fill=c_color, width=2)
    bdraw.line([(12, b_card_h - 12), (12 + c_len, b_card_h - 12)], fill=c_color, width=2)
    bdraw.line([(12, b_card_h - 12 - c_len), (12, b_card_h - 12)], fill=c_color, width=2)
    bdraw.line([(b_card_w - 12 - c_len, b_card_h - 12), (b_card_w - 12, b_card_h - 12)], fill=c_color, width=2)
    bdraw.line([(b_card_w - 12, b_card_h - 12 - c_len), (b_card_w - 12, b_card_h - 12)], fill=c_color, width=2)

    # Top slot cutout
    bdraw.rounded_rectangle([(b_card_w // 2 - 32, 16), (b_card_w // 2 + 32, 24)], radius=4, fill=(15, 23, 42, 255), outline=(14, 165, 233, 140), width=1)

    # Top Badge: OFFICIAL ID
    bdraw.rounded_rectangle([(b_card_w // 2 - 110, 36), (b_card_w // 2 + 110, 60)], radius=12, fill=(14, 165, 233, 30), outline=(56, 189, 248, 160), width=1)
    bdraw.text((b_card_w // 2, 48), "* OFFICIAL PORTFOLIO CARD *", font=f_xs, fill=(56, 189, 248, 255), anchor="mm")

    # Name on back
    bdraw.text((b_card_w // 2, 88), "BILLY WICAKSONO", font=f_large, fill=(255, 255, 255, 255), anchor="mm")
    bdraw.text((b_card_w // 2, 116), "Junior Software Engineer & IT Support", font=f_sm, fill=(148, 163, 184, 255), anchor="mm")

    # Real QR Code to Billy's GitHub
    qr = qrcode.QRCode(version=1, box_size=5, border=2)
    qr.add_data("https://github.com/bilker29")
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="#38bdf8", back_color="#07101f").convert("RGBA")
    
    qr_size = 180
    qr_img = qr_img.resize((qr_size, qr_size), Image.Resampling.LANCZOS)
    qr_x = (b_card_w - qr_size) // 2
    qr_y = 146
    
    # QR Glow border
    bdraw.rounded_rectangle([(qr_x - 8, qr_y - 8), (qr_x + qr_size + 8, qr_y + qr_size + 8)], radius=14, fill=(10, 20, 38, 255), outline=(56, 189, 248, 200), width=2)
    back_im.paste(qr_img, (qr_x, qr_y), qr_img)

    # Scan me label
    bdraw.text((b_card_w // 2, qr_y + qr_size + 22), "SCAN TO OPEN GITHUB PROFILE", font=f_xs, fill=(56, 189, 248, 255), anchor="mm")
    bdraw.text((b_card_w // 2, qr_y + qr_size + 38), "github.com/bilker29", font=f_sm, fill=(241, 245, 249, 255), anchor="mm")

    # Academic & Certification credentials panel (dark navy background)
    panel_y = qr_y + qr_size + 58
    bdraw.rounded_rectangle([(24, panel_y), (b_card_w - 24, panel_y + 114)], radius=12, fill=(10, 20, 38, 240), outline=(56, 189, 248, 120), width=1)
    
    cred_items = [
        ("INSTITUTION", "Universitas Pasundan (UNPAS) Bandung"),
        ("STUDY PROGRAM", "Teknik Informatika • Semester 4"),
        ("ACADEMIC GPA", "IPK 3.76 / 4.00 (KIP-Kuliah Awardee)"),
        ("CERTIFICATION", "BNSP IT Support & Cisco Networking"),
    ]
    for idx, (label, val) in enumerate(cred_items):
        item_y = panel_y + 14 + idx * 24
        bdraw.text((36, item_y), label + ":", font=f_xs, fill=(56, 189, 248, 255))
        bdraw.text((150, item_y), val, font=f_xs, fill=(241, 245, 249, 255))

    # Social links & ID serial footer
    bdraw.text((b_card_w // 2, panel_y + 132), "LinkedIn: billy-wicaksono-315898372", font=f_xs, fill=(148, 163, 184, 220), anchor="mm")
    bdraw.text((b_card_w // 2, panel_y + 152), "ID: BW-2026-UNPAS-04 • ALL RIGHTS RESERVED", font=f_xs, fill=(100, 116, 139, 220), anchor="mm")

    base.paste(back_im, (bx1, by1))

    output_path = "d:/Portofolio/public/assets/card_custom.png"
    base.save(output_path, "PNG")
    print(f"Texture saved successfully to {output_path} (size: {width}x{height})")

if __name__ == "__main__":
    create_card_texture()
