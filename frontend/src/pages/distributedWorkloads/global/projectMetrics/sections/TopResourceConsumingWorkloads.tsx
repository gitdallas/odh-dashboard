import * as React from 'react';
import { Card, CardBody, CardTitle, Gallery, GalleryItem } from '@patternfly/react-core';
import {
  ChartLegend,
  ChartLabel,
  ChartDonut,
  ChartThemeColor,
  ChartTooltip,
} from '@patternfly/react-charts';
import { DistributedWorkloadsContext } from '~/concepts/distributedWorkloads/DistributedWorkloadsContext';
import {
  TopWorkloadUsageType,
  WorkloadStatusType,
  getStatusInfo,
  getWorkloadName,
} from '~/concepts/distributedWorkloads/utils';
import EmptyStateErrorMessage from '~/components/EmptyStateErrorMessage';
import { LoadingState } from '~/pages/distributedWorkloads/components/LoadingState';
import { NoWorkloadState } from '~/pages/distributedWorkloads/components/NoWorkloadState';
import { truncateString } from '~/utilities/string';
import { bytesAsPreciseGiB, roundNumber } from '~/utilities/number';

interface TopResourceConsumingWorkloadsChartProps {
  metricLabel: string;
  unitLabel: string;
  data: TopWorkloadUsageType;
  convertUnits?: (num?: number) => number;
}

const TopResourceConsumingWorkloadsChart: React.FC<TopResourceConsumingWorkloadsChartProps> = ({
  metricLabel,
  unitLabel,
  data,
  convertUnits = (num) => num || 0,
}) => {
  const [extraWidth, setExtraWidth] = React.useState(0);
  const chartBaseWidth = 375;
  const legendBaseWidth = 260;
  const chartHeight = 150;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const updateWidth = () => {
    if (containerRef.current) {
      setExtraWidth(Math.max(chartBaseWidth, containerRef.current.clientWidth) - chartBaseWidth);
    }
  };
  React.useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);
  const { otherUsage, totalUsage } = data;
  const tw = [
    {
        "workload": {
            "apiVersion": "kueue.x-k8s.io/v1beta1",
            "kind": "Workload",
            "metadata": {
                "creationTimestamp": "2024-04-03T13:32:48Z",
                "finalizers": [
                    "kueue.x-k8s.io/resource-in-use"
                ],
                "generation": 1,
                "labels": {
                    "kueue.x-k8s.io/job-uid": "70d5efd1-16ba-4da1-a501-a720c87ca0e8"
                },
                "managedFields": [
                    {
                        "apiVersion": "kueue.x-k8s.io/v1beta1",
                        "fieldsType": "FieldsV1",
                        "fieldsV1": {
                            "f:status": {
                                "f:admission": {
                                    "f:clusterQueue": {},
                                    "f:podSetAssignments": {
                                        "k:{\"name\":\"main\"}": {
                                            ".": {},
                                            "f:count": {},
                                            "f:flavors": {
                                                "f:cpu": {},
                                                "f:memory": {}
                                            },
                                            "f:name": {},
                                            "f:resourceUsage": {
                                                "f:cpu": {},
                                                "f:memory": {}
                                            }
                                        }
                                    }
                                },
                                "f:conditions": {
                                    "k:{\"type\":\"Admitted\"}": {
                                        ".": {},
                                        "f:lastTransitionTime": {},
                                        "f:message": {},
                                        "f:reason": {},
                                        "f:status": {},
                                        "f:type": {}
                                    },
                                    "k:{\"type\":\"QuotaReserved\"}": {
                                        ".": {},
                                        "f:lastTransitionTime": {},
                                        "f:message": {},
                                        "f:reason": {},
                                        "f:status": {},
                                        "f:type": {}
                                    }
                                }
                            }
                        },
                        "manager": "kueue-admission",
                        "operation": "Apply",
                        "subresource": "status",
                        "time": "2024-04-03T13:32:48Z"
                    },
                    {
                        "apiVersion": "kueue.x-k8s.io/v1beta1",
                        "fieldsType": "FieldsV1",
                        "fieldsV1": {
                            "f:metadata": {
                                "f:finalizers": {
                                    ".": {},
                                    "v:\"kueue.x-k8s.io/resource-in-use\"": {}
                                },
                                "f:labels": {
                                    ".": {},
                                    "f:kueue.x-k8s.io/job-uid": {}
                                },
                                "f:ownerReferences": {
                                    ".": {},
                                    "k:{\"uid\":\"70d5efd1-16ba-4da1-a501-a720c87ca0e8\"}": {}
                                }
                            },
                            "f:spec": {
                                ".": {},
                                "f:active": {},
                                "f:podSets": {
                                    ".": {},
                                    "k:{\"name\":\"main\"}": {
                                        ".": {},
                                        "f:count": {},
                                        "f:minCount": {},
                                        "f:name": {},
                                        "f:template": {
                                            ".": {},
                                            "f:metadata": {},
                                            "f:spec": {
                                                ".": {},
                                                "f:containers": {},
                                                "f:dnsPolicy": {},
                                                "f:restartPolicy": {},
                                                "f:schedulerName": {},
                                                "f:securityContext": {},
                                                "f:terminationGracePeriodSeconds": {}
                                            }
                                        }
                                    }
                                },
                                "f:priority": {},
                                "f:priorityClassSource": {},
                                "f:queueName": {}
                            }
                        },
                        "manager": "kueue",
                        "operation": "Update",
                        "time": "2024-04-03T13:32:48Z"
                    }
                ],
                "name": "job-pi-small-2-09c61",
                "namespace": "non-admin-test-2",
                "ownerReferences": [
                    {
                        "apiVersion": "batch/v1",
                        "blockOwnerDeletion": true,
                        "controller": true,
                        "kind": "Job",
                        "name": "pi-small-2",
                        "uid": "70d5efd1-16ba-4da1-a501-a720c87ca0e8"
                    }
                ],
                "resourceVersion": "16423657",
                "uid": "7ebec48d-9cb9-4730-93e2-a1e22274bfc8"
            },
            "spec": {
                "active": true,
                "podSets": [
                    {
                        "count": 2,
                        "minCount": 1,
                        "name": "main",
                        "template": {
                            "metadata": {},
                            "spec": {
                                "containers": [
                                    {
                                        "command": [
                                            "perl",
                                            "-Mbignum=bpi",
                                            "-wle",
                                            "print bpi(20000)"
                                        ],
                                        "image": "perl:5.34.0",
                                        "imagePullPolicy": "IfNotPresent",
                                        "name": "pi",
                                        "resources": {
                                            "requests": {
                                                "cpu": "500m",
                                                "memory": "50Mi"
                                            }
                                        },
                                        "terminationMessagePath": "/dev/termination-log",
                                        "terminationMessagePolicy": "File"
                                    }
                                ],
                                "dnsPolicy": "ClusterFirst",
                                "restartPolicy": "Never",
                                "schedulerName": "default-scheduler",
                                "securityContext": {},
                                "terminationGracePeriodSeconds": 30
                            }
                        }
                    }
                ],
                "priority": 0,
                "priorityClassSource": "",
                "queueName": "local-queue-2"
            },
            "status": {
                "admission": {
                    "clusterQueue": "test-queue",
                    "podSetAssignments": [
                        {
                            "count": 2,
                            "flavors": {
                                "cpu": "test-flavor",
                                "memory": "test-flavor"
                            },
                            "name": "main",
                            "resourceUsage": {
                                "cpu": "1",
                                "memory": "100Mi"
                            }
                        }
                    ]
                },
                "conditions": [
                    {
                        "lastTransitionTime": "2024-04-03T13:32:48Z",
                        "message": "Quota reserved in ClusterQueue test-queue",
                        "reason": "QuotaReserved",
                        "status": "True",
                        "type": "QuotaReserved"
                    },
                    {
                        "lastTransitionTime": "2024-04-03T13:32:48Z",
                        "message": "The workload is admitted",
                        "reason": "Admitted",
                        "status": "True",
                        "type": "Admitted"
                    }
                ]
            }
        },
        "usage": 2.100728666666667
    },
    {
        "workload": {
            "apiVersion": "kueue.x-k8s.io/v1beta1",
            "kind": "Workload",
            "metadata": {
                "creationTimestamp": "2024-04-03T13:32:48Z",
                "finalizers": [
                    "kueue.x-k8s.io/resource-in-use"
                ],
                "generation": 1,
                "labels": {
                    "kueue.x-k8s.io/job-uid": "21cb9bc0-19e8-4079-ab4b-a243a903d2b4"
                },
                "managedFields": [
                    {
                        "apiVersion": "kueue.x-k8s.io/v1beta1",
                        "fieldsType": "FieldsV1",
                        "fieldsV1": {
                            "f:status": {
                                "f:admission": {
                                    "f:clusterQueue": {},
                                    "f:podSetAssignments": {
                                        "k:{\"name\":\"main\"}": {
                                            ".": {},
                                            "f:count": {},
                                            "f:flavors": {
                                                "f:cpu": {},
                                                "f:memory": {}
                                            },
                                            "f:name": {},
                                            "f:resourceUsage": {
                                                "f:cpu": {},
                                                "f:memory": {}
                                            }
                                        }
                                    }
                                },
                                "f:conditions": {
                                    "k:{\"type\":\"Admitted\"}": {
                                        ".": {},
                                        "f:lastTransitionTime": {},
                                        "f:message": {},
                                        "f:reason": {},
                                        "f:status": {},
                                        "f:type": {}
                                    },
                                    "k:{\"type\":\"QuotaReserved\"}": {
                                        ".": {},
                                        "f:lastTransitionTime": {},
                                        "f:message": {},
                                        "f:reason": {},
                                        "f:status": {},
                                        "f:type": {}
                                    }
                                }
                            }
                        },
                        "manager": "kueue-admission",
                        "operation": "Apply",
                        "subresource": "status",
                        "time": "2024-04-03T13:32:48Z"
                    },
                    {
                        "apiVersion": "kueue.x-k8s.io/v1beta1",
                        "fieldsType": "FieldsV1",
                        "fieldsV1": {
                            "f:metadata": {
                                "f:finalizers": {
                                    ".": {},
                                    "v:\"kueue.x-k8s.io/resource-in-use\"": {}
                                },
                                "f:labels": {
                                    ".": {},
                                    "f:kueue.x-k8s.io/job-uid": {}
                                },
                                "f:ownerReferences": {
                                    ".": {},
                                    "k:{\"uid\":\"21cb9bc0-19e8-4079-ab4b-a243a903d2b4\"}": {}
                                }
                            },
                            "f:spec": {
                                ".": {},
                                "f:active": {},
                                "f:podSets": {
                                    ".": {},
                                    "k:{\"name\":\"main\"}": {
                                        ".": {},
                                        "f:count": {},
                                        "f:minCount": {},
                                        "f:name": {},
                                        "f:template": {
                                            ".": {},
                                            "f:metadata": {},
                                            "f:spec": {
                                                ".": {},
                                                "f:containers": {},
                                                "f:dnsPolicy": {},
                                                "f:restartPolicy": {},
                                                "f:schedulerName": {},
                                                "f:securityContext": {},
                                                "f:terminationGracePeriodSeconds": {}
                                            }
                                        }
                                    }
                                },
                                "f:priority": {},
                                "f:priorityClassSource": {},
                                "f:queueName": {}
                            }
                        },
                        "manager": "kueue",
                        "operation": "Update",
                        "time": "2024-04-03T13:32:48Z"
                    }
                ],
                "name": "job-pi-small-1-363b9",
                "namespace": "non-admin-test-2",
                "ownerReferences": [
                    {
                        "apiVersion": "batch/v1",
                        "blockOwnerDeletion": true,
                        "controller": true,
                        "kind": "Job",
                        "name": "pi-small-1",
                        "uid": "21cb9bc0-19e8-4079-ab4b-a243a903d2b4"
                    }
                ],
                "resourceVersion": "16423663",
                "uid": "f8754322-b9e5-4208-952c-6b38c5d90f10"
            },
            "spec": {
                "active": true,
                "podSets": [
                    {
                        "count": 2,
                        "minCount": 1,
                        "name": "main",
                        "template": {
                            "metadata": {},
                            "spec": {
                                "containers": [
                                    {
                                        "command": [
                                            "perl",
                                            "-Mbignum=bpi",
                                            "-wle",
                                            "print bpi(20000)"
                                        ],
                                        "image": "perl:5.34.0",
                                        "imagePullPolicy": "IfNotPresent",
                                        "name": "pi",
                                        "resources": {
                                            "requests": {
                                                "cpu": "500m",
                                                "memory": "50Mi"
                                            }
                                        },
                                        "terminationMessagePath": "/dev/termination-log",
                                        "terminationMessagePolicy": "File"
                                    }
                                ],
                                "dnsPolicy": "ClusterFirst",
                                "restartPolicy": "Never",
                                "schedulerName": "default-scheduler",
                                "securityContext": {},
                                "terminationGracePeriodSeconds": 30
                            }
                        }
                    }
                ],
                "priority": 0,
                "priorityClassSource": "",
                "queueName": "local-queue-2"
            },
            "status": {
                "admission": {
                    "clusterQueue": "test-queue",
                    "podSetAssignments": [
                        {
                            "count": 2,
                            "flavors": {
                                "cpu": "test-flavor",
                                "memory": "test-flavor"
                            },
                            "name": "main",
                            "resourceUsage": {
                                "cpu": "1",
                                "memory": "100Mi"
                            }
                        }
                    ]
                },
                "conditions": [
                    {
                        "lastTransitionTime": "2024-04-03T13:32:48Z",
                        "message": "Quota reserved in ClusterQueue test-queue",
                        "reason": "QuotaReserved",
                        "status": "True",
                        "type": "QuotaReserved"
                    },
                    {
                        "lastTransitionTime": "2024-04-03T13:32:48Z",
                        "message": "The workload is admitted",
                        "reason": "Admitted",
                        "status": "True",
                        "type": "Admitted"
                    }
                ]
            }
        },
        "usage": 1.9714356000000002
    },
    {
        "workload": {
            "apiVersion": "kueue.x-k8s.io/v1beta1",
            "kind": "Workload",
            "metadata": {
                "creationTimestamp": "2024-04-03T13:32:48Z",
                "finalizers": [
                    "kueue.x-k8s.io/resource-in-use"
                ],
                "generation": 1,
                "labels": {
                    "kueue.x-k8s.io/job-uid": "958cb635-ee28-4269-aa17-acb671082a4b"
                },
                "managedFields": [
                    {
                        "apiVersion": "kueue.x-k8s.io/v1beta1",
                        "fieldsType": "FieldsV1",
                        "fieldsV1": {
                            "f:status": {
                                "f:admission": {
                                    "f:clusterQueue": {},
                                    "f:podSetAssignments": {
                                        "k:{\"name\":\"main\"}": {
                                            ".": {},
                                            "f:count": {},
                                            "f:flavors": {
                                                "f:cpu": {},
                                                "f:memory": {}
                                            },
                                            "f:name": {},
                                            "f:resourceUsage": {
                                                "f:cpu": {},
                                                "f:memory": {}
                                            }
                                        }
                                    }
                                },
                                "f:conditions": {
                                    "k:{\"type\":\"Admitted\"}": {
                                        ".": {},
                                        "f:lastTransitionTime": {},
                                        "f:message": {},
                                        "f:reason": {},
                                        "f:status": {},
                                        "f:type": {}
                                    },
                                    "k:{\"type\":\"QuotaReserved\"}": {
                                        ".": {},
                                        "f:lastTransitionTime": {},
                                        "f:message": {},
                                        "f:reason": {},
                                        "f:status": {},
                                        "f:type": {}
                                    }
                                }
                            }
                        },
                        "manager": "kueue-admission",
                        "operation": "Apply",
                        "subresource": "status",
                        "time": "2024-04-03T13:32:48Z"
                    },
                    {
                        "apiVersion": "kueue.x-k8s.io/v1beta1",
                        "fieldsType": "FieldsV1",
                        "fieldsV1": {
                            "f:metadata": {
                                "f:finalizers": {
                                    ".": {},
                                    "v:\"kueue.x-k8s.io/resource-in-use\"": {}
                                },
                                "f:labels": {
                                    ".": {},
                                    "f:kueue.x-k8s.io/job-uid": {}
                                },
                                "f:ownerReferences": {
                                    ".": {},
                                    "k:{\"uid\":\"958cb635-ee28-4269-aa17-acb671082a4b\"}": {}
                                }
                            },
                            "f:spec": {
                                ".": {},
                                "f:active": {},
                                "f:podSets": {
                                    ".": {},
                                    "k:{\"name\":\"main\"}": {
                                        ".": {},
                                        "f:count": {},
                                        "f:minCount": {},
                                        "f:name": {},
                                        "f:template": {
                                            ".": {},
                                            "f:metadata": {},
                                            "f:spec": {
                                                ".": {},
                                                "f:containers": {},
                                                "f:dnsPolicy": {},
                                                "f:restartPolicy": {},
                                                "f:schedulerName": {},
                                                "f:securityContext": {},
                                                "f:terminationGracePeriodSeconds": {}
                                            }
                                        }
                                    }
                                },
                                "f:priority": {},
                                "f:priorityClassSource": {},
                                "f:queueName": {}
                            }
                        },
                        "manager": "kueue",
                        "operation": "Update",
                        "time": "2024-04-03T13:32:48Z"
                    }
                ],
                "name": "job-pi-small-3-cf2cc",
                "namespace": "non-admin-test-2",
                "ownerReferences": [
                    {
                        "apiVersion": "batch/v1",
                        "blockOwnerDeletion": true,
                        "controller": true,
                        "kind": "Job",
                        "name": "pi-small-3",
                        "uid": "958cb635-ee28-4269-aa17-acb671082a4b"
                    }
                ],
                "resourceVersion": "16423669",
                "uid": "292c4c09-420a-4abf-813b-38864b63e0eb"
            },
            "spec": {
                "active": true,
                "podSets": [
                    {
                        "count": 2,
                        "minCount": 1,
                        "name": "main",
                        "template": {
                            "metadata": {},
                            "spec": {
                                "containers": [
                                    {
                                        "command": [
                                            "perl",
                                            "-Mbignum=bpi",
                                            "-wle",
                                            "print bpi(20000)"
                                        ],
                                        "image": "perl:5.34.0",
                                        "imagePullPolicy": "IfNotPresent",
                                        "name": "pi",
                                        "resources": {
                                            "requests": {
                                                "cpu": "500m",
                                                "memory": "50Mi"
                                            }
                                        },
                                        "terminationMessagePath": "/dev/termination-log",
                                        "terminationMessagePolicy": "File"
                                    }
                                ],
                                "dnsPolicy": "ClusterFirst",
                                "restartPolicy": "Never",
                                "schedulerName": "default-scheduler",
                                "securityContext": {},
                                "terminationGracePeriodSeconds": 30
                            }
                        }
                    }
                ],
                "priority": 0,
                "priorityClassSource": "",
                "queueName": "local-queue-2"
            },
            "status": {
                "admission": {
                    "clusterQueue": "test-queue",
                    "podSetAssignments": [
                        {
                            "count": 2,
                            "flavors": {
                                "cpu": "test-flavor",
                                "memory": "test-flavor"
                            },
                            "name": "main",
                            "resourceUsage": {
                                "cpu": "1",
                                "memory": "100Mi"
                            }
                        }
                    ]
                },
                "conditions": [
                    {
                        "lastTransitionTime": "2024-04-03T13:32:48Z",
                        "message": "Quota reserved in ClusterQueue test-queue",
                        "reason": "QuotaReserved",
                        "status": "True",
                        "type": "QuotaReserved"
                    },
                    {
                        "lastTransitionTime": "2024-04-03T13:32:48Z",
                        "message": "The workload is admitted",
                        "reason": "Admitted",
                        "status": "True",
                        "type": "Admitted"
                    }
                ]
            }
        },
        "usage": 1.5298057
    }];
    const topWorkloads = [...tw, ...tw];

  return (
    <div ref={containerRef} style={{ height: `${chartHeight}px` }}>
      <ChartDonut
        constrainToVisibleArea
        labelRadius={50}
        labelComponent={<ChartTooltip center={{ x: 150, y: 0 }} />}
        height={chartHeight}
        ariaTitle={`${metricLabel} chart`}
        data={
          topWorkloads.length
            ? [
                ...topWorkloads.map(({ workload, usage }) => ({
                  x: getWorkloadName(workload as any),
                  y: 1, //roundNumber(convertUnits(usage), 3),
                })),
                ...(otherUsage
                  ? [{ x: 'Other', y: roundNumber(convertUnits(otherUsage), 3) }]
                  : []),
              ]
            : [{ x: `No workload is consuming ${unitLabel}`, y: 1 }]
        }
        labels={
          topWorkloads.length
            ? ({ datum }) => `${datum.x}: ${datum.y} ${unitLabel}`
            : ({ datum }) => datum.x
        }
        legendComponent={
          <ChartLegend
            data={[
              ...topWorkloads.map(({ workload }) => ({
                name: truncateString(getWorkloadName(workload as any), 13 + extraWidth / 15),
              })),
              ...(otherUsage ? [{ name: 'Other' }] : []),
            ]}
            gutter={15}
            labelComponent={<ChartLabel style={{ fontSize: 14 }} />}
            itemsPerRow={Math.ceil(topWorkloads.length / 2)}
          />
        }
        legendOrientation="vertical"
        legendPosition="right"
        name={`topResourceConsuming${metricLabel}`}
        padding={{
          bottom: 0,
          left: 0,
          right: legendBaseWidth + extraWidth,
          top: 0,
        }}
        subTitle={unitLabel}
        title={String(roundNumber(convertUnits(totalUsage)))}
        themeColor={topWorkloads.length ? ChartThemeColor.multi : ChartThemeColor.gray}
        width={chartBaseWidth + extraWidth}
      />
    </div>
  );
};

export const TopResourceConsumingWorkloads: React.FC = () => {
  const { workloads, projectCurrentMetrics } = React.useContext(DistributedWorkloadsContext);
  const { topWorkloadsByUsage } = projectCurrentMetrics;
  const requiredFetches = [workloads, projectCurrentMetrics];
  const error = requiredFetches.find((f) => !!f.error)?.error;
  const loaded = requiredFetches.every((f) => f.loaded);

  // if (error) {
  //   return <EmptyStateErrorMessage title="Error loading workloads" bodyText={error.message} />;
  // }

  // if (!loaded) {
  //   return <LoadingState />;
  // }

  // if (
  //   !topWorkloadsByUsage.cpuCoresUsed.totalUsage &&
  //   !topWorkloadsByUsage.memoryBytesUsed.totalUsage
  // ) {
  //   const workloadStatuses = [];
  //   if (workloads.data.some((wl) => getStatusInfo(wl).status === WorkloadStatusType.Succeeded)) {
  //     workloadStatuses.push('completed');
  //   }
  //   if (workloads.data.some((wl) => getStatusInfo(wl).status === WorkloadStatusType.Failed)) {
  //     workloadStatuses.push('failed');
  //   }

  //   if (workloadStatuses.length) {
  //     return (
  //       <NoWorkloadState
  //         warn={workloadStatuses.includes('failed')}
  //         title={`All distributed workloads have ${workloadStatuses.join(' or ')}`}
  //       />
  //     );
  //   }
  //   return <NoWorkloadState />;
  // }

  return (
    <Gallery minWidths={{ default: '100%', xl: '50%' }}>
      <GalleryItem>
        <Card isPlain isCompact>
          <CardTitle>CPU</CardTitle>
          <CardBody>
            <TopResourceConsumingWorkloadsChart
              metricLabel="CPU"
              unitLabel="cores"
              data={topWorkloadsByUsage.cpuCoresUsed}
            />
          </CardBody>
        </Card>
      </GalleryItem>
      <GalleryItem>
        <Card isPlain isCompact>
          <CardTitle>Memory</CardTitle>
          <CardBody>
            <TopResourceConsumingWorkloadsChart
              metricLabel="Memory"
              unitLabel="GiB"
              data={topWorkloadsByUsage.memoryBytesUsed}
              convertUnits={bytesAsPreciseGiB}
            />
          </CardBody>
        </Card>
      </GalleryItem>
    </Gallery>
  );
};
