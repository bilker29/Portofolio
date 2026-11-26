import os
import qrcode
from PIL import Image, ImageDraw, ImageFont

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def draw_gradient_panel(draw, w, h, top_rgb, bot_rgb):
    for y in range(h):
        ratio = y / max(1, h - 1)
        r = int(top_rgb[0] + (bot_rgb[0] - top_rgb[0]) * ratio)
        g = int(top_rgb[1] + (bot_rgb[1] - top_rgb[1]) * ratio)
        b = int(top_rgb[2] + (bot_rgb[2] - top_rgb[2]) * ratio)
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))

def draw_hud_corners(draw, x1, y1, x2, y2, length=24, color=(56, 189, 248, 255), width=3):
    draw.line([(x1, y1), (x1 + length, y1)], fill=color, width=width)
    draw.line([(x1, y1), (x1, y1 + length)], fill=color, width=width)
    draw.line([(x2 - length, y1), (x2, y1)], fill=color, width=width)
    draw.line([(x2, y1), (x2, y1 + length)], fill=color, width=width)
    draw.line([(x1, y2), (x1 + length, y2)], fill=color, width=width)
    draw.line([(x1, y2 - length), (x1, y2)], fill=color, width=width)
    draw.line([(x2 - length, y2), (x2, y2)], fill=color, width=width)
    draw.line([(x2, y2 - length), (x2, y2)], fill=color, width=width)

def create_card_texture():
    width, height = 1024, 1024
    # Fill entire canvas with deep midnight ocean navy so bevels/edges never show white/black gaps
    base = Image.new("RGBA", (width, height), (8, 20, 38, 255))

    font_bold = "C:/Windows/Fonts/segoeuib.ttf"
    font_reg = "C:/Windows/Fonts/segoeui.ttf"
    font_arial_b = "C:/Windows/Fonts/arialbd.ttf"

    f_title = get_font(font_arial_b, 50)
    f_name = get_font(font_bold, 25)
    f_sub = get_font(font_reg, 15)
    f_body = get_font(font_bold, 19)
    f_sm = get_font(font_bold, 13)
    f_xs = get_font(font_bold, 11)
    f_badge = get_font(font_bold, 13)
    f_large = get_font(font_bold, 30)

    # Exact GLB UV map (with flipY = false):
    # Front face covers U: 0.000..0.500 (x: 0..512), V: 0.000..0.757 (y: 0..776)
    # Back face covers  U: 0.500..1.000 (x: 512..1024), V: 0.000..0.757 (y: 0..776)
    face_w, face_h = 512, 776

    # ─────────────────────────────────────────────────────────────────────────
    # 1. FRONT FACE (x: 0..512, y: 0..776)
    # ─────────────────────────────────────────────────────────────────────────
    front_im = Image.new("RGBA", (face_w, face_h), (8, 20, 38, 255))
    fdraw = ImageDraw.Draw(front_im)
    draw_gradient_panel(fdraw, face_w, face_h, (8, 22, 42), (10, 32, 60))

    # Subtle ambient glow circle at top-right & bottom-left
    glow = Image.new("RGBA", (face_w, face_h), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse([(260, -80), (580, 240)], fill=(14, 165, 233, 45))
    gdraw.ellipse([(-100, 520), (240, 860)], fill=(16, 185, 129, 35))
    front_im = Image.alpha_composite(front_im, glow)
    fdraw = ImageDraw.Draw(front_im)

    # Dot tech matrix
    for x in range(28, face_w - 20, 22):
        for y in range(28, face_h - 20, 22):
            fdraw.point((x, y), fill=(56, 189, 248, 55))

    # Crisp inner HUD card border
    fdraw.rounded_rectangle([(14, 14), (face_w - 14, face_h - 14)], radius=20, outline=(56, 189, 248, 170), width=2)
    draw_hud_corners(fdraw, 22, 22, face_w - 22, face_h - 22, length=24, color=(56, 189, 248, 240), width=3)

    # Top header row (kept strictly clear of center clip/clamp zone x=210..302, y=0..76)
    fdraw.rounded_rectangle([(28, 32), (124, 58)], radius=8, fill=(14, 52, 92, 255), outline=(56, 189, 248, 255), width=2)
    fdraw.text((76, 45), "JUNIOR", font=f_badge, fill=(125, 211, 252, 255), anchor="mm")

    fdraw.text((face_w - 28, 34), "UNPAS BANDUNG", font=f_xs, fill=(241, 245, 249, 255), anchor="ra")
    fdraw.text((face_w - 28, 50), "GDGoC • GSA 2026", font=f_xs, fill=(52, 211, 153, 255), anchor="ra")

    # Main Title: DEVELOPER
    fdraw.text((28, 86), "DEV", font=f_title, fill=(255, 255, 255, 255))
    fdraw.text((132, 86), "ELOPER", font=f_title, fill=(56, 189, 248, 255))

    # Certified Tag right beside title
    fdraw.rounded_rectangle([(face_w - 140, 94), (face_w - 28, 120)], radius=12, fill=(10, 56, 54, 255), outline=(52, 211, 153, 255), width=2)
    fdraw.text((face_w - 84, 107), "BNSP CERTIFIED", font=get_font(font_bold, 10), fill=(167, 243, 208, 255), anchor="mm")

    # Photo Box (square aspect, crisp frame)
    photo_box = (28, 150, 340, 462)
    pw_box = photo_box[2] - photo_box[0]
    ph_box = photo_box[3] - photo_box[1]

    photo_path = "d:/Portofolio/public/Photo.jpg"
    if os.path.exists(photo_path):
        user_photo = Image.open(photo_path).convert("RGBA")
        pw, ph = user_photo.size
        min_dim = min(pw, ph)
        crop_x = (pw - min_dim) // 2
        crop_y = (ph - min_dim) // 2
        user_photo = user_photo.crop((crop_x, crop_y, crop_x + min_dim, crop_y + min_dim))
        user_photo = user_photo.resize((pw_box, ph_box), Image.Resampling.LANCZOS)

        mask = Image.new("L", (pw_box, ph_box), 0)
        ImageDraw.Draw(mask).rounded_rectangle([(0, 0), (pw_box, ph_box)], radius=16, fill=255)
        front_im.paste(user_photo, (photo_box[0], photo_box[1]), mask)

    fdraw.rounded_rectangle([photo_box[0], photo_box[1], photo_box[2], photo_box[3]], radius=16, outline=(56, 189, 248, 200), width=3)

    # VERIFIED ID Floating Pill on Photo
    fdraw.rounded_rectangle([(photo_box[0] + 10, photo_box[3] - 34), (photo_box[0] + 148, photo_box[3] - 10)], radius=8, fill=(8, 18, 34, 255), outline=(52, 211, 153, 255), width=2)
    fdraw.ellipse([(photo_box[0] + 20, photo_box[3] - 26), (photo_box[0] + 28, photo_box[3] - 18)], fill=(16, 185, 129, 255))
    fdraw.text((photo_box[0] + 36, photo_box[3] - 22), "VERIFIED ID", font=f_xs, fill=(110, 231, 183, 255), anchor="lm")

    # Vertical Sidebar beside photo: TEKNIK INFORMATIKA
    sidebar_x = photo_box[2] + 14
    sidebar_x2 = face_w - 28
    sidebar_w = sidebar_x2 - sidebar_x
    fdraw.rounded_rectangle([(sidebar_x, photo_box[1]), (sidebar_x2, photo_box[3])], radius=14, fill=(12, 30, 56, 255), outline=(56, 189, 248, 170), width=2)

    vert_im = Image.new("RGBA", (ph_box, sidebar_w), (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(vert_im)
    vdraw.text((ph_box // 2, sidebar_w // 2), "TEKNIK INFORMATIKA", font=get_font(font_arial_b, 20), fill=(125, 211, 252, 255), anchor="mm")
    vert_rot = vert_im.rotate(90, expand=True)
    front_im.paste(vert_rot, (sidebar_x + (sidebar_w - vert_rot.width) // 2, photo_box[1] + (ph_box - vert_rot.height) // 2), vert_rot)

    # Nameplate Box
    name_y = 480
    fdraw.rounded_rectangle([(28, name_y), (face_w - 28, name_y + 72)], radius=14, fill=(12, 28, 52, 255), outline=(56, 189, 248, 190), width=2)
    fdraw.text((44, name_y + 12), "BILLY WICAKSONO", font=f_name, fill=(255, 255, 255, 255))
    # Verified check icon
    fdraw.ellipse([(282, name_y + 18), (302, name_y + 38)], fill=(14, 165, 233, 255))
    fdraw.line([(287, name_y + 28), (291, name_y + 32), (298, name_y + 23)], fill=(255, 255, 255, 255), width=2)
    fdraw.text((44, name_y + 44), "Software Engineer & IT Infrastructure", font=f_sub, fill=(186, 230, 253, 255))

    # 3 KPI Pills Row
    stat_y = 568
    col_w = (face_w - 56 - 20) // 3
    stats = [("IPK", "3.76"), ("BEASISWA", "KIP-K"), ("CLUB", "GDGoC PR")]
    for i, (lbl, val) in enumerate(stats):
        bx = 28 + i * (col_w + 10)
        fdraw.rounded_rectangle([(bx, stat_y), (bx + col_w, stat_y + 58)], radius=10, fill=(10, 24, 46, 255), outline=(56, 189, 248, 160), width=2)
        fdraw.text((bx + col_w // 2, stat_y + 20), val, font=f_body, fill=(56, 189, 248, 255), anchor="mm")
        fdraw.text((bx + col_w // 2, stat_y + 43), lbl, font=f_xs, fill=(148, 163, 184, 255), anchor="mm")

    # Portfolio Gradient Strip
    strip_y = 642
    fdraw.rounded_rectangle([(28, strip_y), (face_w - 28, strip_y + 44)], radius=10, fill=(14, 62, 108, 255), outline=(56, 189, 248, 255), width=2)
    fdraw.text((face_w // 2, strip_y + 22), "PORTFOLIO  •  UNIVERSITAS PASUNDAN", font=f_badge, fill=(255, 255, 255, 255), anchor="mm")

    # Quote Footer
    fdraw.text((face_w // 2, 706), "Code Clean, Think Bigger — Continuous Excellence", font=f_xs, fill=(148, 163, 184, 230), anchor="mm")
    fdraw.text((face_w // 2, 728), "github.com/bilker29  •  ID: BW-2026-04", font=f_xs, fill=(56, 189, 248, 220), anchor="mm")

    base.paste(front_im, (0, 0))

    # ─────────────────────────────────────────────────────────────────────────
    # 2. BACK FACE (x: 512..1024, y: 0..776)
    # ─────────────────────────────────────────────────────────────────────────
    back_im = Image.new("RGBA", (face_w, face_h), (8, 20, 38, 255))
    bdraw = ImageDraw.Draw(back_im)
    draw_gradient_panel(bdraw, face_w, face_h, (6, 16, 32), (12, 28, 52))

    # Diagonal geometric pattern
    for i in range(-4, 22):
        y_pos = i * 44
        bdraw.line([(0, y_pos), (face_w, y_pos - 95)], fill=(56, 189, 248, 26), width=1)
        bdraw.line([(0, y_pos), (face_w, y_pos + 95)], fill=(16, 185, 129, 22), width=1)

    b_glow = Image.new("RGBA", (face_w, face_h), (0, 0, 0, 0))
    bgdraw = ImageDraw.Draw(b_glow)
    bgdraw.ellipse([(100, 140), (412, 450)], fill=(14, 165, 233, 35))
    back_im = Image.alpha_composite(back_im, b_glow)
    bdraw = ImageDraw.Draw(back_im)

    bdraw.rounded_rectangle([(14, 14), (face_w - 14, face_h - 14)], radius=20, outline=(56, 189, 248, 170), width=2)
    draw_hud_corners(bdraw, 22, 22, face_w - 22, face_h - 22, length=24, color=(52, 211, 153, 240), width=3)

    # Top corner labels (keeping center x=210..302, y=0..76 clear for clip/clamp!)
    bdraw.text((30, 38), "OFFICIAL ID", font=f_xs, fill=(56, 189, 248, 255))
    bdraw.text((face_w - 30, 38), "VERIFIED 2026", font=f_xs, fill=(52, 211, 153, 255), anchor="ra")

    # Header Name below clamp
    bdraw.rounded_rectangle([(96, 82), (face_w - 96, 108)], radius=13, fill=(14, 52, 92, 255), outline=(56, 189, 248, 230), width=2)
    bdraw.text((face_w // 2, 95), "PORTFOLIO CREDENTIAL CARD", font=f_xs, fill=(186, 230, 253, 255), anchor="mm")

    bdraw.text((face_w // 2, 138), "BILLY WICAKSONO", font=f_large, fill=(255, 255, 255, 255), anchor="mm")
    bdraw.text((face_w // 2, 168), "Software Engineer • IT Infrastructure Enthusiast", font=f_xs, fill=(148, 163, 184, 255), anchor="mm")

    # Real QR Code -> github.com/bilker29
    qr = qrcode.QRCode(version=1, box_size=6, border=2)
    qr.add_data("https://github.com/bilker29")
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="#38bdf8", back_color="#071324").convert("RGBA")
    qr_size = 186
    qr_img = qr_img.resize((qr_size, qr_size), Image.Resampling.LANCZOS)
    qr_x = (face_w - qr_size) // 2
    qr_y = 196

    bdraw.rounded_rectangle([(qr_x - 10, qr_y - 10), (qr_x + qr_size + 10, qr_y + qr_size + 10)], radius=16, fill=(7, 19, 36, 255), outline=(56, 189, 248, 220), width=2)
    back_im.paste(qr_img, (qr_x, qr_y), qr_img)

    bdraw.text((face_w // 2, qr_y + qr_size + 26), "SCAN TO VIEW GITHUB REPOSITORY", font=f_xs, fill=(56, 189, 248, 255), anchor="mm")
    bdraw.text((face_w // 2, qr_y + qr_size + 44), "https://github.com/bilker29", font=f_sm, fill=(241, 245, 249, 255), anchor="mm")

    # Credentials Card matching latest CV
    panel_y = qr_y + qr_size + 66
    bdraw.rounded_rectangle([(28, panel_y), (face_w - 28, panel_y + 158)], radius=14, fill=(10, 22, 42, 255), outline=(56, 189, 248, 170), width=2)

    creds = [
        ("UNIV", "Universitas Pasundan (GPA 3.76/4.00)"),
        ("INTERN", "PT Berkah Teknologi Terdepan (SWE)"),
        ("TEACH", "Lab Asst Java & Web Tech Examiner"),
        ("ORG", "GDGoC Core Team PR & Google GSA"),
        ("CERTS", "LSP BNSP IT • TOEIC • Dicoding • DAN 1"),
    ]
    for idx, (lbl, val) in enumerate(creds):
        yy = panel_y + 18 + idx * 27
        bdraw.text((42, yy), lbl, font=f_xs, fill=(52, 211, 153, 255))
        bdraw.text((104, yy), val, font=f_xs, fill=(241, 245, 249, 255))

    # Footer on Back
    bdraw.text((face_w // 2, panel_y + 180), "billywicaksono.999@gmail.com  •  Bandung, ID", font=f_xs, fill=(148, 163, 184, 240), anchor="mm")
    bdraw.text((face_w // 2, panel_y + 202), "BW-2026-UNPAS  •  VERIFIED PORTFOLIO PASS", font=f_xs, fill=(56, 189, 248, 220), anchor="mm")

    base.paste(back_im, (face_w, 0))

    output_card = "d:/Portofolio/public/assets/card_custom.png"
    base.save(output_card, "PNG")
    print(f"Saved {output_card}")

    # ─────────────────────────────────────────────────────────────────────────
    # 3. CUSTOM LANYARD STRAP TEXTURE (1024 x 128) - clean, smooth, zero alias
    # ─────────────────────────────────────────────────────────────────────────
    bw, bh = 1024, 128
    band_im = Image.new("RGBA", (bw, bh), (10, 24, 48, 255))
    b_draw = ImageDraw.Draw(band_im)

    # Woven dark-navy subtle pattern + glowing sky-blue side stripes
    b_draw.rectangle([(0, 0), (bw, 10)], fill=(2, 132, 199, 255))
    b_draw.rectangle([(0, bh - 10), (bw, bh)], fill=(13, 148, 136, 255))
    b_draw.rectangle([(0, 12), (bw, 15)], fill=(56, 189, 248, 180))
    b_draw.rectangle([(0, bh - 15), (bw, bh - 12)], fill=(52, 211, 153, 180))

    band_font = get_font(font_arial_b, 42)
    band_draw_text = "BILLY WICAKSONO   •   UNPAS"
    b_draw.text((bw // 2, bh // 2), band_draw_text, font=band_font, fill=(248, 250, 252, 255), anchor="mm")

    output_band = "d:/Portofolio/public/assets/band_custom.png"
    band_im.save(output_band, "PNG")
    print(f"Saved {output_band}")

if __name__ == "__main__":
    create_card_texture()
