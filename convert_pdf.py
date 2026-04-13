import markdown2
from xhtml2pdf import pisa
import sys

def convert_md_to_pdf(md_file, pdf_file):
    with open(md_file, 'r', encoding='utf-8') as f:
        md_text = f.read()
    
    # Convert markdown to html with extended features
    html_content = markdown2.markdown(md_text, extras=["tables", "fenced-code-blocks", "header-ids"])
    
    # Inject styling to make it look professional and business-ready
    full_html = f"""
    <html>
    <head>
    <style>
        @page {{
            size: A4;
            margin: 2cm;
            @frame footer {{
                -pdf-frame-content: footerContent;
                bottom: 1cm;
                margin-left: 2cm;
                margin-right: 2cm;
                height: 1cm;
                text-align: right;
            }}
        }}
        body {{
            font-family: Helvetica, sans-serif;
            font-size: 13px;
            line-height: 1.6;
            color: #333;
        }}
        h1 {{
            color: #1a7a4a;
            font-size: 32px;
            padding-bottom: 5px;
            margin-bottom: 20px;
        }}
        h2 {{
            color: #22a05e;
            font-size: 22px;
            margin-top: 30px;
            border-bottom: 1px solid #1a7a4a;
            padding-bottom: 5px;
        }}
        h3 {{
            color: #105c36;
            font-size: 16px;
        }}
        p {{
            margin-bottom: 12px;
            text-align: justify;
        }}
        ul, ol {{
            margin-bottom: 15px;
        }}
        li {{
            margin-bottom: 8px;
        }}
        strong {{
            color: #1a7a4a;
        }}
    </style>
    </head>
    <body>
        {html_content}
        <div id="footerContent">FarmWise AI Confidential</div>
    </body>
    </html>
    """
    
    with open(pdf_file, 'wb') as f:
        pisa_status = pisa.CreatePDF(full_html, dest=f)
    
    if pisa_status.err:
        print(f"Error creating PDF {pdf_file}")
    else:
        print(f"Successfully generated {pdf_file}")

if __name__ == "__main__":
    convert_md_to_pdf('FarmWise_Business_Proposal.md', 'FarmWise_Business_Proposal.pdf')
    convert_md_to_pdf('FarmWise_Project_Report.md', 'FarmWise_Project_Report.pdf')
