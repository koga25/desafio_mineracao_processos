import pandas as pandas
import datetime as datetime
import json
from pm4py.objects.log.util import dataframe_utils
from pm4py.objects.conversion.log import converter as log_converter
from pm4py.algo.discovery.dfg import algorithm as dfg_discovery
from pm4py.visualization.dfg import visualizer as dfg_visualization
from natsort import natsorted


def csvToSvg(csvFile):
    # convert csv to event log
    csvEventLog = pandas.read_csv(csvFile, sep=";")
    csvEventLog = dataframe_utils.convert_timestamp_columns_in_df(csvEventLog)
    csvEventLog = csvEventLog.sort_values("Case")
    # pm4py needs a column with case:concept:name, Case wasn't being recognised as one, so we rename it. Same for ActivityCode and End
    # also, we cant use two timestamps (Start, End) in DFG, as seen in this github issue thread:
    # https://github.com/pm4py/pm4py-core/issues/221
    csvEventLog.rename(columns={"Case": "case:concept:name", "ActivityCode": "concept:name",
                                "End": "time:timestamp"},
                       inplace=True)
    csvEventLog = log_converter.apply(csvEventLog)
    # convert event log to dfg
    dfg = dfg_discovery.apply(csvEventLog)
    parameters = {
        dfg_visualization.Variants.FREQUENCY.value.Parameters.FORMAT: "svg"}
    gviz = dfg_visualization.apply(
        dfg, log=csvEventLog, variant=dfg_visualization.Variants.FREQUENCY, parameters=parameters)

    # convert dfg to svg, then serialize it to send to the client
    svgString = dfg_visualization.serialize(gviz)

    return svgString


def csvToInfo(csvFile):
    # get quantity of Cases
    csvFile = pandas.read_csv(csvFile, sep=";")
    # Transform date string to datetime, remove all rows that results in a null time, then get the time elapsed by each row.
    csvTimeEachActivity = csvFile[["ActivityCode", "Start", "End"]]

    csvTimeEachActivity["End"] = pandas.to_datetime(
        csvTimeEachActivity["End"])
    csvTimeEachActivity["Start"] = pandas.to_datetime(
        csvTimeEachActivity["Start"], errors="coerce")
    csvTimeEachActivity = csvTimeEachActivity.dropna()

    csvTimeEachActivity["TimeElapsed"] = (
        csvTimeEachActivity["End"] - csvTimeEachActivity["Start"])

    # Group each unique activity by time, sort the activities using Natural Sort to make it sort like a human.
    csvTimeEachActivity = csvTimeEachActivity.drop(columns=["End", "Start"])
    csvTimeEachActivity = csvTimeEachActivity.groupby(["ActivityCode"]).mean()

    csvTimeEachActivity = csvTimeEachActivity.reindex(
        natsorted(csvTimeEachActivity.index))

    csvTimeEachActivity = csvTimeEachActivity.to_json()

    # Get quantity of each activity
    csvQuantityEachActivity = csvFile.value_counts(
        subset="ActivityCode", sort=False, ascending=True)
    csvQuantityEachActivity = csvQuantityEachActivity.reindex(
        natsorted(csvQuantityEachActivity.index))
    csvQuantityEachActivity = csvQuantityEachActivity.to_json()

    return csvTimeEachActivity, csvQuantityEachActivity
