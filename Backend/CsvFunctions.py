import pandas as pandas
from pm4py.objects.log.util import dataframe_utils
from pm4py.objects.conversion.log import converter as log_converter
from pm4py.algo.discovery.dfg import algorithm as dfg_discovery
from pm4py.visualization.dfg import visualizer as dfg_visualization


def parseCsv(csvFile):
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
