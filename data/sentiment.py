import csv
from textblob import TextBlob

with open('billboard_original.csv','r') as csvinput:
    with open('clean_billboard_with_sentiment.csv', 'w') as csvoutput:
        writer = csv.writer(csvoutput, lineterminator='\n')
        reader = csv.reader(csvinput)

        all = []
        row = next(reader)
        row.append('Sentiment')
        all.append(row)

        for row in reader:
            blob = TextBlob(row[4])
            row.append(blob.sentiment.polarity)
            if blob.sentiment.polarity != 0:
                all.append(row)

        writer.writerows(all)
