# import necessary libraries
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
  # for the webscrap in the articles page
import requests
from bs4 import BeautifulSoup as b
import pandas as pd
import webbrowser
#################################################
# Flask Setup
#################################################
app = Flask(__name__, static_url_path='/static')

#################################################
# Database Setup
#################################################


#import psycopg2

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect

engine=create_engine('postgres://postgres:postgres@localhost:5432/CAT-Decarbonisation-Indicator')
connection = engine.connect()
inspector = inspect(engine)
Base = automap_base()
Base.prepare(engine, reflect=True)

Emissions = Base.classes.raw_data4
inspector.get_table_names()
# bankdata = Base.classes.world_bank
#-----------------#
# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")
# create route that renders country.html template
@app.route("/country")
def country():
    return render_template("/country.html")
# create route that renders country.html template
@app.route("/temperature")
def temperature():
    return render_template("/temperature.html")
# create route that renders country.html template
@app.route("/policy_projections")
def policy():
    return render_template("/policy_projections.html")
# create route that renders insights.html template
@app.route("/insights")
def insights():
    return render_template("/insights.html")
# create route that renders stats.html template ok
@app.route("/stats")
def stats():
    return render_template("/stats.html")
#create route that renders geojson.html template
@app.route("/worldmap")
def worlmap():
    return render_template("/worldmap.html")
# create route that renders data.html template
@app.route("/data")
def data():
    return render_template("/data.html")
@app.route("/articles")
def articles():
    #file = '..resources/policy_projections.csv'

#read the csv and to convert to json

    return render_template("/articles.html")
# create route that gets all the data
@app.route("/alldata")
def alldata():
    session = Session(engine)
    results = session.query(Emissions.indicator,Emissions.country,Emissions.year).all()
    indicator=[]
    country=[]
    year=[]
    for i in results:
        indicator.append(i[0])
        country.append(i[1])
        year.append(i[2])
    indicator = list( dict.fromkeys(indicator))
    country = list( dict.fromkeys(country))
    year = list( dict.fromkeys(year))
    emission_data = [{
        "indicator": indicator,
        "country": country,
        "year": year,
    }]
    return jsonify(emission_data)
# for the graph on Country page
@app.route("/api/emission/<grabcountry>/<grabindicator>")
def countrygraph(grabcountry,grabindicator):
    session = Session(engine)
    results = session.query(Emissions.indicator, Emissions.unit,Emissions.country,Emissions.year,Emissions.value,Emissions.variable).\
        filter(grabindicator == Emissions.indicator).\
        filter(grabcountry == Emissions.country).all()

    indicator=[]
    unit=[]
    country=[]
    year=[]
    value=[]
    variable=[]
    for i in results:
        indicator.append(i[0])
        unit.append(i[1])
        country.append(i[2])
        year.append(i[3])
        value.append(i[4])
        variable.append(i[5])

    emission_data = [{
        "indicator": indicator,
        "unit": unit,
        "country": country,
        "year": year,
        "value": value,
        "variable":variable
    }]

    return jsonify(emission_data)

# for the World graph on Home page 
@app.route("/api/emission/World/<grabindicator>")
def worldgraph(grabindicator):
    session = Session(engine)
    results = session.query(Emissions.indicator, Emissions.unit,Emissions.country,Emissions.year,Emissions.value).\
        filter(grabindicator == Emissions.indicator).\
        filter("World" == Emissions.country).all()

    indicator=[]
    unit=[]
    country=[]
    year=[]
    value=[]
    for i in results:
        indicator.append(i[0])
        unit.append(i[1])
        country.append(i[2])
        year.append(i[3])
        value.append(i[4])


    emission_data = [{
        "indicator": indicator,
        "unit": unit,
        "country": country,
        "year": year,
        "value": value
    }]

    return jsonify(emission_data)

# for the World Map on the Home page
@app.route("/api/emission/wholeworld/<grabyear>/<grabindicator>")
def worldmap (grabyear,grabindicator):
    session = Session(engine)
    results = session.query(Emissions.indicator, Emissions.unit,Emissions.country,Emissions.year,Emissions.value).\
        filter(grabyear == Emissions.year).\
        filter(grabindicator == Emissions.indicator).all()
    indicator=[]
    unit=[]
    country=[]
    year=[]
    value=[]
    for i in results:
        indicator.append(i[0])
        unit.append(i[1])
        country.append(i[2])
        year.append(i[3])
        value.append(i[4])


    emission_data = [{
        "indicator": indicator,
        "unit": unit,
        "country": country,
        "year": year,
        "value": value
    }]

    return jsonify(emission_data)

@app.route("/api/news/<grabyear>/<grabcountry>")
def news (grabyear,grabcountry):




    Country = grabcountry
    Before = grabyear
    url = f"https://www.google.co.in/search?q=+{Country}+co2+emissions+scholarly+articles+before:+{Before}"
    print (url)
    response = requests.get(url)
    
    soup = b(response.text,"lxml")
    
    articles=[]
    r = soup.find_all('div', attrs = {'class': 'BNeawe vvjwJb AP7Wnd'})
    
    for i in range(len(r)):
        articles.append(r[i].text)

    urls = soup.find_all('div', attrs = {'class': 'kCrYT'})
    Links=[]
    counter=1
    for link in urls:
        href = link.find('a')
        try:
            raw_website = href.get('href')
            clean_web = raw_website[7:]
            Links.append(clean_web)
            if counter ==1: 
                article_content_response =requests.get(clean_web)
                article_soup=b(response.text,"lxml")
                print(article_soup)
            counter+=1

        except:
            continue
    newsdata = [{
        "articles": articles,
        "links": Links,
        # "summary": summaries
    }]
    return jsonify(newsdata)
    # return jsonify({"data":"hello"})

# - - - - - - - - - - - - - #



if __name__ == "__main__":
    app.run()