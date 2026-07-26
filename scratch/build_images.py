import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

# Define font paths for Windows
SYSTEM_FONT_SERIF = "C:\\Windows\\Fonts\\georgia.ttf"
SYSTEM_FONT_SERIF_BOLD = "C:\\Windows\\Fonts\\georgiab.ttf"
SYSTEM_FONT_SANS = "C:\\Windows\\Fonts\\arial.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except IOError:
        return ImageFont.load_default()

def draw_volumetric_spotlight(width, height, center_x, floor_y):
    # Draw volumetric light cone
    # From top (center_x, 0) expanding to floor (center_x - 180 to center_x + 180, floor_y)
    top_w = 20
    bottom_w = 260
    
    # Create mask for spotlight gradient
    mask = Image.new("L", (width, height), 0)
    mask_draw = ImageDraw.Draw(mask)
    
    # Draw fading spotlight cone
    for i in range(100):
        alpha = int(12 * (1.0 - i/100.0)) # Soft fading opacity
        w = top_w + (bottom_w - top_w) * (i / 100.0)
        y = floor_y * (i / 100.0)
        
        points = [
            (center_x - w/2, y),
            (center_x + w/2, y),
            (center_x + (w + 2.6)/2, y + floor_y/100.0),
            (center_x - (w + 2.6)/2, y + floor_y/100.0)
        ]
        mask_draw.polygon(points, fill=alpha)
        
    # Apply mask on a red/white spotlight image
    spot_img = Image.new("RGBA", (width, height), (212, 0, 31, 0)) # Red tint spot
    spot_draw = ImageDraw.Draw(spot_img)
    # Draw glow core
    for i in range(50):
        alpha = int(18 * (1.0 - i/50.0))
        w = (top_w + (bottom_w - top_w) * (i/50.0)) * 0.4
        y = floor_y * (i/50.0)
        spot_draw.polygon([
            (center_x - w/2, y),
            (center_x + w/2, y),
            (center_x + (w+2)/2, y + floor_y/50.0),
            (center_x - (w+2)/2, y + floor_y/50.0)
        ], fill=(255, 255, 255, alpha))
        
    return spot_img, mask

def draw_motorcycle_silhouette(draw, cx, cy, style_type):
    # Draws an elegant line-art profile of a historic bike
    # Wheels
    draw.ellipse([cx - 95, cy - 45, cx - 45, cy + 5], outline=(255, 255, 255, 60), width=2) # Front
    draw.ellipse([cx + 45, cy - 45, cx + 95, cy + 5], outline=(255, 255, 255, 60), width=2) # Rear
    draw.ellipse([cx - 80, cy - 30, cx - 60, cy - 10], outline=(255, 255, 255, 30), width=1) # Front hub
    draw.ellipse([cx + 60, cy - 30, cx + 80, cy - 10], outline=(255, 255, 255, 30), width=1) # Rear hub
    
    if style_type == "1950s":
        # Classic rounded bubble tank, spoked low stance
        draw.line([cx - 70, cy - 20, cx - 30, cy - 70], fill=(255, 255, 255, 90), width=2) # Fork
        draw.line([cx - 30, cy - 70, cx - 10, cy - 75], fill=(255, 255, 255, 90), width=2) # Bars
        # Curved round cowl
        draw.arc([cx - 50, cy - 90, cx + 20, cy - 40], start=180, end=360, fill=(255, 255, 255, 120), width=2)
        # Rounded rear seat
        draw.arc([cx + 20, cy - 70, cx + 85, cy - 30], start=160, end=300, fill=(255, 255, 255, 90), width=2)
        # Straight frame line
        draw.line([cx - 30, cy - 50, cx + 60, cy - 35], fill=(255, 255, 255, 60), width=1)
        # Low exhaust pipe
        draw.line([cx - 10, cy - 10, cx + 90, cy - 10], fill=(212, 0, 31, 140), width=2)
        
    elif style_type == "1970s":
        # Low elongated cafe racer, clip ons, L-twin cylinders
        draw.line([cx - 70, cy - 20, cx - 25, cy - 75], fill=(255, 255, 255, 90), width=2) # Fork
        # Nose fairing outline
        draw.line([cx - 45, cy - 75, cx - 15, cy - 75], fill=(255, 255, 255, 110), width=2)
        draw.arc([cx - 40, cy - 85, cx - 10, cy - 65], start=90, end=270, fill=(255, 255, 255, 90), width=1)
        # Long flat fuel tank
        draw.line([cx - 20, cy - 70, cx + 30, cy - 68], fill=(255, 255, 255, 120), width=2)
        draw.line([cx + 30, cy - 68, cx + 55, cy - 45], fill=(255, 255, 255, 100), width=2) # Seat dip
        # L-Twin cylinder outlines (V shape)
        draw.line([cx - 10, cy - 30, cx - 35, cy - 45], fill=(212, 0, 31, 150), width=2) # Front cyl
        draw.line([cx - 5, cy - 30, cx - 5, cy - 60], fill=(212, 0, 31, 120), width=2) # Vert cyl
        # Exhaust sweeping back
        draw.line([cx - 5, cy - 20, cx + 85, cy - 15], fill=(255, 255, 255, 95), width=2)
        
    elif style_type == "1990s":
        # Ducati 916: aggressive tank, high tail, underseat exhaust path
        draw.line([cx - 70, cy - 20, cx - 25, cy - 80], fill=(255, 255, 255, 95), width=2) # Fork
        # Sharp front nose
        draw.line([cx - 35, cy - 80, cx - 10, cy - 78], fill=(255, 255, 255, 110), width=2)
        draw.line([cx - 10, cy - 78, cx - 30, cy - 45], fill=(255, 255, 255, 80), width=2)
        # Deep sculptured fuel tank
        draw.line([cx - 25, cy - 78, cx, cy - 85], fill=(255, 255, 255, 130), width=2)
        draw.line([cx, cy - 85, cx + 30, cy - 50], fill=(255, 255, 255, 110), width=2)
        # High tail panel
        draw.line([cx + 30, cy - 50, cx + 75, cy - 65], fill=(255, 255, 255, 110), width=2)
        draw.line([cx + 75, cy - 65, cx + 80, cy - 50], fill=(255, 255, 255, 80), width=2)
        # Underseat pipe routing (Red highlight)
        draw.line([cx + 10, cy - 35, cx + 60, cy - 50], fill=(212, 0, 31, 140), width=2)
        draw.line([cx + 60, cy - 50, cx + 85, cy - 52], fill=(212, 0, 31, 180), width=3) # Underseat muffler
        
    elif style_type == "2000s":
        # Desmosedici GP7: MotoGP aerodynamic curves, rear hump
        draw.line([cx - 70, cy - 20, cx - 20, cy - 82], fill=(255, 255, 255, 95), width=2) # Fork
        # Full racing fairing nose
        draw.line([cx - 35, cy - 82, cx - 5, cy - 75], fill=(255, 255, 255, 120), width=2)
        draw.arc([cx - 35, cy - 75, cx + 25, cy - 20], start=120, end=240, fill=(255, 255, 255, 70), width=2) # Fairing belly
        # Aerodynamic tank
        draw.line([cx - 20, cy - 80, cx + 15, cy - 84], fill=(255, 255, 255, 130), width=2)
        draw.line([cx + 15, cy - 84, cx + 35, cy - 50], fill=(255, 255, 255, 90), width=2)
        # High rear hump tail
        draw.line([cx + 35, cy - 50, cx + 80, cy - 70], fill=(255, 255, 255, 120), width=2)
        draw.line([cx + 80, cy - 70, cx + 85, cy - 50], fill=(255, 255, 255, 80), width=2)
        # Red chassis trellis frame highlights
        draw.line([cx - 10, cy - 65, cx + 25, cy - 55], fill=(212, 0, 31, 160), width=3)
        
    elif style_type == "Panigale V4":
        # Ultra modern: biplane winglets, sharp aggressive angles, split tail
        draw.line([cx - 70, cy - 20, cx - 20, cy - 84], fill=(255, 255, 255, 100), width=2) # Gold fork line
        # Sharp split nose
        draw.line([cx - 30, cy - 84, cx - 12, cy - 80], fill=(255, 255, 255, 130), width=2)
        # Biplane winglets (Red neon)
        draw.line([cx - 25, cy - 62, cx - 10, cy - 62], fill=(212, 0, 31, 200), width=4) # Winglet
        draw.line([cx - 28, cy - 54, cx - 15, cy - 54], fill=(212, 0, 31, 165), width=3) # Sub winglet
        # Angular fuel tank
        draw.line([cx - 20, cy - 82, cx + 18, cy - 88], fill=(255, 255, 255, 130), width=2)
        draw.line([cx + 18, cy - 88, cx + 40, cy - 52], fill=(255, 255, 255, 100), width=2)
        # Hollow split tail section
        draw.line([cx + 40, cy - 52, cx + 85, cy - 72], fill=(255, 255, 255, 120), width=2)
        draw.line([cx + 85, cy - 72, cx + 70, cy - 52], fill=(255, 255, 255, 90), width=2)
        # Monocoque engine accent
        draw.ellipse([cx + 5, cy - 45, cx + 30, cy - 20], outline=(212, 0, 31, 110), width=1)

def build_evolution_image():
    # 1. Create base canvas
    width, height = 1920, 1080
    bg = Image.new("RGBA", (width, height), (0, 0, 0, 255))
    
    # Render ambient radial lighting
    draw = ImageDraw.Draw(bg)
    floor_y = 760
    
    # 5 sections for chronological lineup
    centers = [260, 610, 960, 1310, 1660]
    eras = ["1950s", "1970s", "1990s", "2000s", "Panigale V4"]
    names = ["Desmo 125 GP", "750 Imola SS", "Ducati 916", "Desmosedici GP7", "Panigale V4 R"]
    years = ["1956", "1972", "1994", "2007", "2026"]
    
    # Volumetric spotlights
    for cx in centers:
        spot_img, mask = draw_volumetric_spotlight(width, height, cx, floor_y)
        bg = Image.alpha_composite(bg, spot_img)
        
    # Re-draw object to apply silhouettes
    draw = ImageDraw.Draw(bg)
    
    # Draw floor dividing line (soft reflective glass floor)
    draw.line([0, floor_y, width, floor_y], fill=(255, 255, 255, 20), width=1)
    
    # Draw museum tags / labels
    font_year = get_font(SYSTEM_FONT_SERIF_BOLD, 22)
    font_name = get_font(SYSTEM_FONT_SANS, 13)
    font_subtitle = get_font(SYSTEM_FONT_SERIF, 14)
    
    # Draw motorcycles (normal and reflected)
    for idx, cx in enumerate(centers):
        style = eras[idx]
        
        # 1. Reflection (mirrored silhouette drawn with high transparency, flipped and blurred)
        # We can draw the reflection by drawing it directly on a temporary layer, flipping it vertically, and drawing it below floor_y
        temp_lay = Image.new("RGBA", (300, 160), (0,0,0,0))
        temp_draw = ImageDraw.Draw(temp_lay)
        # Draw bike centered at (150, 80)
        draw_motorcycle_silhouette(temp_draw, 150, 80, style)
        # Flip vertically
        refl_lay = temp_lay.transpose(Image.FLIP_TOP_BOTTOM)
        
        # Create reflection transparency mask
        refl_mask = Image.new("L", (300, 160), 0)
        refl_mask_draw = ImageDraw.Draw(refl_mask)
        # Gradient fading downward
        for y in range(160):
            alpha = int(45 * (1.0 - y / 160.0))
            refl_mask_draw.line([0, y, 300, y], fill=alpha)
            
        bg.paste(refl_lay, (cx - 150, floor_y), mask=refl_mask)
        
        # 2. Draw actual motorcycle silhouette
        draw_motorcycle_silhouette(draw, cx, floor_y - 20, style)
        
        # 3. Draw museum info labels below each stand
        tag_y = floor_y + 40
        draw.text((cx, tag_y), years[idx], font=font_year, fill=(255, 255, 255, 220), anchor="mm")
        draw.text((cx, tag_y + 30), names[idx].upper(), font=font_name, fill=(212, 0, 31, 240), anchor="mm")
        draw.text((cx, tag_y + 50), style.upper() + " ERA", font=font_subtitle, fill=(255, 255, 255, 110), anchor="mm")
        
    # Save as high-quality JPG
    bg.convert("RGB").save("public/assets/evolution_hero.jpg", "JPEG", quality=95)
    print("Evolution image generated successfully.")

def build_mechanical_image():
    width, height = 1920, 1080
    bg = Image.new("RGBA", (width, height), (0, 0, 0, 255))
    draw = ImageDraw.Draw(bg)
    
    # Engineering Grid Background (Very subtle)
    for x in range(0, width, 60):
        draw.line([x, 0, x, height], fill=(255, 255, 255, 6), width=1)
    for y in range(0, height, 60):
        draw.line([0, y, width, y], fill=(255, 255, 255, 6), width=1)
        
    # Spotlights highlighting center
    spot_img, mask = draw_volumetric_spotlight(width, height, width//2, height - 100)
    bg = Image.alpha_composite(bg, spot_img)
    draw = ImageDraw.Draw(bg)
    
    # Drawing Exploded Mechanical Parts of Desmosedici
    # Let's define the parts layout:
    # 1. Front Fork/Wheel (Exploded to the left): cx = 350, cy = 600
    # 2. Engine (Centered): cx = 960, cy = 540
    # 3. Frame Monocoque (Exploded upwards): cx = 960, cy = 300
    # 4. Winglets (Exploded left/right of nose): cx = 680, cy = 400
    # 5. Rear Swingarm/Wheel (Exploded to the right): cx = 1550, cy = 600
    # 6. Exhaust (Exploded below): cx = 1150, cy = 720
    
    # Draw Dashed connecting assembly lines
    # From Front fork to engine
    draw.line([350, 600, 960, 540], fill=(255, 255, 255, 30), width=1)
    # From Rear swingarm to engine
    draw.line([1550, 600, 960, 540], fill=(255, 255, 255, 30), width=1)
    # From Frame to engine
    draw.line([960, 300, 960, 540], fill=(255, 255, 255, 30), width=1)
    # From Winglets to frame
    draw.line([680, 400, 960, 350], fill=(255, 255, 255, 20), width=1)
    # From Exhaust to engine bottom
    draw.line([1150, 720, 960, 580], fill=(255, 255, 255, 20), width=1)
    
    # Draw Component line art
    # Part 1: Front Fork (cx=350, cy=600)
    draw.ellipse([350-45, 600-45, 350+45, 600+45], outline=(255, 255, 255, 90), width=2) # Wheel
    draw.line([350-45, 600, 350+45, 600], fill=(255, 255, 255, 40), width=1) # Spokes
    draw.line([350, 600-45, 350, 600+45], fill=(255, 255, 255, 40), width=1)
    draw.line([350-5, 600, 350+40, 600-140], fill=(255, 255, 255, 140), width=3) # Fork tube
    draw.line([350+10, 600-30, 350+25, 600-5], fill=(212, 0, 31, 200), width=3) # Brembo caliper
    
    # Part 2: Engine Block (cx=960, cy=540)
    # Desmosedici V4 casing details
    draw.rectangle([960-70, 540-50, 960+70, 540+50], outline=(255, 255, 255, 100), width=2, fill=(15, 15, 15, 240))
    # Clutch basket outer ring
    draw.ellipse([960+10, 540-10, 960+60, 540+40], outline=(212, 0, 31, 180), width=2)
    # Cylinder head banks (V4 angles)
    draw.line([960-40, 540-50, 960-80, 540-90], fill=(255, 255, 255, 110), width=3)
    draw.line([960+20, 540-50, 960+50, 540-100], fill=(255, 255, 255, 110), width=3)
    
    # Part 3: Frame Monocoque (cx=960, cy=300)
    # High tech carbon chassis layout
    draw.polygon([
        (960-50, 300+20),
        (960+60, 300+20),
        (960+30, 300-30),
        (960-35, 300-30)
    ], outline=(255, 255, 255, 140), fill=(20, 20, 20, 220))
    
    # Part 4: Winglet Stabilizer (cx=680, cy=400)
    draw.line([680-35, 400, 680+35, 400+10], fill=(212, 0, 31, 220), width=4) # Dual profile wings
    draw.line([680-25, 400+15, 680+25, 400+22], fill=(212, 0, 31, 160), width=3)
    
    # Part 5: Rear Swingarm & Wheel (cx=1550, cy=600)
    draw.ellipse([1550-45, 600-45, 1550+45, 600+45], outline=(255, 255, 255, 90), width=2)
    # Single sided swingarm curve
    draw.line([1550, 600, 1550-130, 600-30], fill=(255, 255, 255, 120), width=4)
    # Rear hub
    draw.ellipse([1550-15, 600-15, 1550+15, 600+15], outline=(212, 0, 31, 160), width=2)
    
    # Part 6: Exhaust Muffler (cx=1150, cy=720)
    # Titanium tubes sweeping back
    draw.line([1150-80, 720-10, 1150, 720+5], fill=(255, 255, 255, 100), width=3)
    draw.line([1150, 720+5, 1150+60, 720], fill=(212, 0, 31, 180), width=4)
    
    # Callout Labels and lines
    font_lbl = get_font(SYSTEM_FONT_SERIF_BOLD, 14)
    font_sub = get_font(SYSTEM_FONT_SANS, 11)
    
    labels = [
        ("OHLINS pressurized front damping", "BREMBO Stylema brake assembly", 350, 600, "left"),
        ("AL-ALLOY structural monocoque chassis", "Torsional rigid weight bearing member", 960, 300, "center"),
        ("Dual-profile carbon fiber winglets", "Downforce stability: 37kg @ 300 km/h", 680, 400, "left"),
        ("DESMOSEDICI Stradale V4 engine block", "1,103 cc MotoGP-derived layout (215 hp)", 960, 540, "right"),
        ("Magnesium rear hub single-swingarm", "Unsprung mass reduction linkage", 1550, 600, "right"),
        ("Titanium low-slung exhaust pipes", "Centralized mass pressure wave exit", 1150, 720, "right")
    ]
    
    for l_title, l_desc, x, y, alignment in labels:
        # Draw guidelines pointing to components
        px, py = 0, 0
        if alignment == "left":
            px, py = x - 120, y - 80
            draw.line([x, y, px + 80, py], fill=(255,255,255,35), width=1)
            draw.line([px + 80, py, px, py], fill=(255,255,255,35), width=1)
            draw.text((px, py - 18), l_title.upper(), font=font_lbl, fill=(255,255,255,230))
            draw.text((px, py + 4), l_desc, font=font_sub, fill=(212, 0, 31, 200))
        elif alignment == "right":
            px, py = x + 120, y - 80
            draw.line([x, y, px - 80, py], fill=(255,255,255,35), width=1)
            draw.line([px - 80, py, px, py], fill=(255,255,255,35), width=1)
            draw.text((px, py - 18), l_title.upper(), font=font_lbl, fill=(255,255,255,230), anchor="ra")
            draw.text((px, py + 4), l_desc, font=font_sub, fill=(212, 0, 31, 200), anchor="ra")
        else: # center
            px, py = x, y - 90
            draw.line([x, y, x, py], fill=(255,255,255,35), width=1)
            draw.text((px, py - 18), l_title.upper(), font=font_lbl, fill=(255,255,255,230), anchor="ma")
            draw.text((px, py + 4), l_desc, font=font_sub, fill=(212, 0, 31, 200), anchor="ma")
            
    # Draw main technical header watermark at background
    font_wm = get_font(SYSTEM_FONT_SERIF, 24)
    draw.text((80, 80), "DESMOSEDICI EXPLODED CAD // CHASSIS-LAYOUT-V4", font=font_wm, fill=(255, 255, 255, 15))
    
    bg.convert("RGB").save("public/assets/mechanical_hero.jpg", "JPEG", quality=95)
    print("Mechanical image generated successfully.")

def build_legends_image():
    # Merge existing user racer photos into a premium high-contrast monochrome panel
    width, height = 1920, 1080
    bg = Image.new("RGBA", (width, height), (3, 3, 3, 255))
    draw = ImageDraw.Draw(bg)
    
    # Panel setup
    panel_w = 400
    panel_h = 880
    panel_y = 100
    gaps = 50
    start_x = (width - (panel_w * 4 + gaps * 3)) // 2 # Center panel grid
    
    racer_files = [
        "public/assets/legend_fogarty.png",
        "public/assets/legend_bayliss.jpg",
        "public/assets/legend_stoner.png",
        "public/assets/legend_bagnaia.jpg"
    ]
    
    champs = [
        "CARL FOGARTY",
        "TROY BAYLISS",
        "CASEY STONER",
        "PECCO BAGNAIA"
    ]
    
    years = [
        "4x WSBK CHAMPION (1994 - 1999)",
        "3x WSBK CHAMPION (2001 - 2008)",
        "2007 MOTOGP CHAMPION",
        "2x MOTOGP CHAMPION (2022 - 2023)"
    ]
    
    font_name = get_font(SYSTEM_FONT_SERIF_BOLD, 22)
    font_desc = get_font(SYSTEM_FONT_SANS, 11)
    
    for i in range(4):
        cx = start_x + i * (panel_w + gaps)
        
        # Load racer image if available, else draw elegant placeholder profile
        racer_img = None
        if os.path.exists(racer_files[i]):
            try:
                racer_img = Image.open(racer_files[i])
            except Exception as e:
                print(f"Could not load {racer_files[i]}: {e}")
                
        # Create panel drawing canvas
        panel = Image.new("RGBA", (panel_w, panel_h), (12, 12, 12, 255))
        p_draw = ImageDraw.Draw(panel)
        
        if racer_img:
            # Resize image to cover panel width keeping aspect
            r_w, r_h = racer_img.size
            scale = panel_w / float(r_w)
            new_h = int(r_h * scale)
            r_resized = racer_img.resize((panel_w, new_h), Image.Resampling.LANCZOS).convert("L") # Convert to Grayscale
            
            # Apply high-contrast curves
            enhancer = ImageEnhance.Contrast(r_resized)
            r_contrasted = enhancer.enhance(1.4)
            
            # Convert back to RGBA
            r_rgba = r_contrasted.convert("RGBA")
            
            # Apply color tint mapping (black to rich deep red/amber highlights)
            # Create monochrome tinted overlay
            tint = Image.new("RGBA", (panel_w, panel_h), (212, 0, 31, 0))
            t_draw = ImageDraw.Draw(tint)
            
            # Draw gradient spotlight overlay on image
            for y in range(panel_h):
                # Volumetric red spotlight on upper half
                spot = max(0, 1.0 - (math.sqrt((panel_w/2.0 - panel_w/2.0)**2 + (y - 150)**2) / 450.0))
                red_alpha = int(45 * spot)
                t_draw.line([0, y, panel_w, y], fill=(212, 0, 31, red_alpha))
                
            # Place image in panel crop
            crop_y = max(0, (new_h - panel_h) // 2)
            panel.paste(r_rgba, (0, 0))
            panel = Image.alpha_composite(panel, tint)
            p_draw = ImageDraw.Draw(panel)
        else:
            # Placeholder silhouette
            p_draw.rectangle([0, 0, panel_w, panel_h], fill=(20, 20, 20, 255))
            p_draw.ellipse([panel_w//2-60, 220, panel_w//2+60, 340], outline=(255, 255, 255, 40), width=2)
            p_draw.polygon([(panel_w//2-100, 500), (panel_w//2+100, 500), (panel_w//2+60, 350), (panel_w//2-60, 350)], outline=(255, 255, 255, 40), width=2)
            
        # Draw volumetric lighting vignette on borders
        border_mask = Image.new("L", (panel_w, panel_h), 255)
        bm_draw = ImageDraw.Draw(border_mask)
        # Top-down red spotlight fade on panel edges
        for y in range(panel_h):
            edge_fade = int(255 * (1.0 - max(0, (y - (panel_h - 180)) / 180.0))) # Fade bottom completely
            bm_draw.line([0, y, panel_w, y], fill=edge_fade)
            
        # Write Names & Championship Years with clean margins
        name_y = panel_h - 90
        # Dark card backing for text readability
        text_overlay = Image.new("RGBA", (panel_w, 140), (0,0,0,210))
        panel.paste(text_overlay, (0, panel_h - 140), mask=text_overlay.split()[3])
        p_draw.text((panel_w//2, name_y), champs[i], font=font_name, fill=(255, 255, 255, 240), anchor="mm")
        p_draw.text((panel_w//2, name_y + 35), years[i].upper(), font=font_desc, fill=(212, 0, 31, 230), anchor="mm")
        
        # Draw frame border (Sleek museum steel frame)
        p_draw.rectangle([0, 0, panel_w, panel_h], outline=(255, 255, 255, 12), width=1)
        # Highlight top border corner in Red
        p_draw.line([0, 0, 50, 0], fill=(212, 0, 31, 220), width=3)
        p_draw.line([0, 0, 0, 50], fill=(212, 0, 31, 220), width=3)
        
        bg.paste(panel, (cx, panel_y))
        
    draw = ImageDraw.Draw(bg)
    # Save as high-quality JPG
    bg.convert("RGB").save("public/assets/legends_hero.jpg", "JPEG", quality=95)
    print("Legends image generated successfully.")

if __name__ == "__main__":
    # Create public assets folder if missing
    os.makedirs("public/assets", exist_ok=True)
    build_evolution_image()
    build_mechanical_image()
    build_legends_image()
